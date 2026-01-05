import { ENV } from "@/config/env";
import UsersService from "@/modules/users/users.service";
import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchAsync";
// import { Request } from "express";
import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   userId?: string;
// }
// export interface RolRequest extends Request {
//   userId?: string;
//   role?: string;
// }

export const authMiddleware = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    throw new AppError("No token provided. Authorization required", 401);

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    throw new AppError("Malformed token. Authorization required", 401);

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    throw new AppError("Malformed token. Authorization required", 401);

  const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
    userId: string;
    iat: number;
    exp: number;
  };
  const user = await UsersService.getUserInfo(decoded.userId);
  req.userId = user?.id;
  _res.locals.userInfo = user;
  next();
});

export const authorizePermissions = (...requiredPermissions: string[]) => {
  return catchAsync(async (_, res, next) => {
    const user = res.locals.userInfo;
    if (!user) {
      throw new AppError(
        "User not found in context. Did you forget authMiddleware?",
        401
      );
    }
    if (user.roles.length > 0 && user.roles[0].name === "Admin") {
      return next();
    }

    const userPermissions = (
      user.permission as { id: string; key: string }[]
    ).map((item) => item.key);

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      throw new AppError(
        `Usuario no tiene permisos rqueridos: ${requiredPermissions.join(
          ", "
        )}`,
        403
      );
    }
    next();
  });
};
