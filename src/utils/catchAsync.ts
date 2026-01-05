import { NextFunction, Response } from "express";
import { Request } from "express";
interface AuthRequest extends Request {
  userId?: string;
}
export type ControllerFunction = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;
const catchAsync = (fn: ControllerFunction) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
