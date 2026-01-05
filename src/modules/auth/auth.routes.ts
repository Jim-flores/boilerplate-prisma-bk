import { Router } from "express";
import authController from "./auth.controller";
import { apiRegistry } from "@/docs/swagger";
import { authResponseSchema, loginSchema } from "./auth.schema";
import { defaultSecurity, errorResponses } from "@/docs/swagger.constants";

const router = Router();
apiRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Iniciar sesión",
  description:
    "Permite a un usuario autenticarse utilizando su email y contraseña. Retorna la información del usuario y un token de autenticación.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Inicio de sesión exitoso",
      content: {
        "application/json": {
          schema: authResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
  security: defaultSecurity,
});
router.post("/login", authController.login);

export default router;
