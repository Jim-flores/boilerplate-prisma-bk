import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import cors from "cors";
import { ENV } from "./config/env";
import expressWinston from "express-winston";
import { logger } from "./utils/logger";
import AppError from "./utils/AppError";
import { globalErrorHandler } from "./middlewares/error.middleware";
import setupSwagger from "./docs/swagger";
import { authMiddleware } from "./middlewares/auth.middleware";
import usersRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";

class server {
  private app: Express;
  private PORT: number = ENV.PORT;
  private ROUTE: string = "/api";
  private HOST: string = ENV.HOST;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      expressWinston.logger({
        winstonInstance: logger,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: true,
        colorize: true,
        ignoreRoute: (req) => req.path === "/favicon.ico",
      })
    );
  }
  routes() {
    setupSwagger(this.app);
    const router = Router();
    this.app.use(this.ROUTE, router);
    
    // routes here
    router.use('/auth', authRoutes)
    router.use(authMiddleware);
    router.use('/users', usersRoutes) 

    this.app.use(
      /^\/(?!$).*$/,
      (req: Request, _res: Response, next: NextFunction) => {
        return next(
          new AppError(`can't find ${req.originalUrl} on this server`, 404)
        );
      }
    );
    this.app.use("/", (_req: Request, res: Response) => {
      res.json({
        status: true,
        server: "OK",
      });
    });
    this.app.use(globalErrorHandler);
  }
  listen() {
    this.app.listen(ENV.NODE_ENV === "prod" ? 3002 : this.PORT, () => {
      const server = `http://${this.HOST}:${this.PORT}`;
      console.log(`🚀 Server deployed at: ${server}`);
      console.log(`📝 View docs at: ${server}/api/docs`);
    });
  }
}
export default server;
