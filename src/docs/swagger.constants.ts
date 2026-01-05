import { RouteConfig } from "@asteasolutions/zod-to-openapi";

export const defaultSecurity = [{ bearerAuth: [] }];

export const errorResponses: RouteConfig["responses"] = {
  401: {
    description:
      "¡Usted no se ha identificado! por favor inicie sesión para obtener acceso.",
  },
  500: {
    description:
      "Ha ocurrido un error interno. Por favor, inténtelo de nuevo más tarde.",
  },
};

export const paginationParams = [
  {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1 },
    description: "Número de página (por defecto: 1)",
  },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 100 },
    description: "Cantidad de resultados por página (por defecto: 10)",
  },
];
