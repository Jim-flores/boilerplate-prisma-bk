import catchAsync from "@/utils/catchAsync";
import { Request, Response } from "express";
import { loginSchema } from "./auth.schema";
import authService from "./auth.service";

class authController {
  static login = catchAsync(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const result = await authService.loginUser(data);
    res.json(result);
  });
}
export default authController;
