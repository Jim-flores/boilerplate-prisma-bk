import { ComponentsObject } from "@asteasolutions/zod-to-openapi/dist/types";

export const securitySchemes: ComponentsObject["securitySchemes"] = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Ingrese su token JWT para autenticarse.",
  },
};
