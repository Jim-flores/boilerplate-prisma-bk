// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDTO } from "./auth.schema";
import prisma from "@/config/db";
import { ENV } from "@/config/env";
import AppError from "@/utils/AppError";

class authService {

// Ruta para registrar usuarios sin token

//   static registerUser = async ({
//     email,
//     name,
//     lastName,
//     password,
//     // status
//   }: RegisterDTO) => {
//     console.log("error")
//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existing) throw new AppError("Correo ya registrado", 409);

//     const hashed = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = await prisma.user.create({
//       data: {
//         name,
//         lastName,
//         email,
//         roleId,
//         // status,
//         password: hashed,
//       },
//     });
//     if (userPermission) {
//       console.log("error")
//       await permissionService.addPermissionToUser({
//         userId: user.id,
//         permissions: userPermission,
//       });
//     }
//     const token = authService.generateToken({ userId: user.id });

//     return {
//       user: { id: user.id, userName: user.userName, email: user.email },
//       token,
//     };
//   };
  static loginUser = async ({ email, password }: LoginDTO) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new AppError(
        "Credenciales incorrectas. Verifique su usuario y contraseña.",
        401
      );

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      throw new AppError(
        "Credenciales incorrectas. Verifique su usuario y contraseña.",
        401
      );

    const token = authService.generateToken({ userId: user.id });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  };

  static generateToken = (payload: { userId: string }) => {
    return jwt.sign(payload, ENV.JWT_SECRET);
  };

  static verifyToken = (token: string) => {
    try {
      return jwt.verify(token, ENV.JWT_SECRET) as {
        userId: string;
        iat: number;
        exp: number;
      };
    } catch (err) {
      throw new Error("Invalid token");
    }
  };
}

export default authService;