import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nombre debe tener almenos 2 caracteres" })
    .openapi({ example: "John" }),
  lastName: z
    .string()
    .min(2, { message: "Apellido debe tener almenos 2 caracteres" })
    .openapi({ example: "Doe" }),
  email: z
    .email({ message: "Ingrese un email valido" })
    .openapi({ example: "john@example.com" }),
  roles: z
    .array(z.string())
    .optional()
    .openapi({
      example: ["roleId1", "roleId2"],
    }),
  //   status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  password: z
    .string()
    .min(6, { message: "Contraseña debe tener almenos 6 caracteres" })
    .openapi({ example: "password123" }),
   branchId: z.string().openapi({ example: "branchId123" }), 
});

export const loginSchema = z.object({
  email: z
    .email({ message: "Ingrese un email valido"}),
  password: z
    .string()
    .min(6, { message: "Contraseña debe tener almenos 6 caracteres" })
    .openapi({ example: "password" }),
});

export const userSchema = z.object({
  id: z.string().openapi({ example: "cme2frqzy0000v2r8ifg089tz" }),
  name: z.string().openapi({ example: "JohnDoe12" }),
  email: z.email().openapi({ example: "john@example.com" }),
});
export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string().openapi({ example: "jwt.token.here" }),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
