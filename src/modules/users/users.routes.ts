import { Router } from "express";
import UsersController from "./users.controller";
import { apiRegistry } from "@/docs/swagger";
import { createUserSchema, userSchema, usersResponseSchema } from "./users.schema";
import { defaultSecurity, errorResponses } from "@/docs/swagger.constants";
import { authorizePermissions } from "@/middlewares/auth.middleware";

const router = Router();

apiRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["Users"],
  summary: "Get all users",
  parameters: [
    {
      name: "search",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Buscar por nombre",
    },
    {
      name: "page",
      in: "query",
      required: false,
      schema: { type: "integer", default: 1 },
      description: "Número de página",
    },
    {
      name: "pageSize",
      in: "query",
      required: false,
      schema: { type: "integer", default: 10 },
      description: "Tamaño de página",
    },
  ],
  responses: {
    200: {
      description: "Usuarios obtenidos exitosamente",
      content: {
        "application/json": {
          schema: usersResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
  security: defaultSecurity,
});

apiRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Obtener usuario por id",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "ID del usuario",
    },
  ],
  responses: {
    200: {
      description: "Usuario obtenido exitosamente",
      content: {
        "application/json": {
          schema: usersResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
  security: defaultSecurity,
});

apiRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["Users"],
  summary: "Crear usuario",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuario creado exitosamente",
    },
    ...errorResponses,
  },
  security: {
    ...defaultSecurity,
  },
});

apiRegistry.registerPath({
    method: "put",
    path: "/users/{id}",
    tags: ["Users"],
    summary: "Actualizar usuario",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "ID del usuario",
      },
    ],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: userSchema.partial(), 
                }
            }
        }
    },
    responses: {
      200: {
        description: "Usuario actualizado exitosamente",
      },
      ...errorResponses,
    },
    security: defaultSecurity,
})

apiRegistry.registerPath({
    method: "delete",
    path: "/users/{id}",
    tags: ["Users"],
    summary: "Eliminar usuario",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "ID del usuario",
      },
    ],
    responses: {
      204: {
        description: "Usuario eliminado exitosamente",
      },
      ...errorResponses,
    },
    security: defaultSecurity,
})


router.get("/", UsersController.getAllUsers);
router.get("/:id", UsersController.getUserById);
router.put("/:id", UsersController.update);
router.use(authorizePermissions("manage_users"));
router.post("/", UsersController.create);
router.delete("/:id", UsersController.delete);
export default router;
