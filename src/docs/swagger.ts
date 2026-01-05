import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { securitySchemes } from "./swagger.security";

// Registro global de endpoints para Swagger
export const apiRegistry = new OpenAPIRegistry();

/**
 * Configura y monta la documentación Swagger en la ruta `/api/docs`.
 *
 * @param app - Instancia de Express donde se monta la documentación.
 */
const setupSwagger = (app: Express) => {
  // Generador de documento OpenAPI a partir de los schemas registrados
  const generator = new OpenApiGeneratorV3(apiRegistry.definitions);

  // Documento base OpenAPI
  const openApiDoc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Nombre_del_proyecto API",
      description: "Documentación oficial de la API de Nombre_del_proyecto.",
      version: "1.0.0",
    },
    servers: [
      {
        url: `/api`,
        description: "Servidor principal",
      },
    ],
  });

  // Agregar esquemas de seguridad (ej: Bearer token)
  openApiDoc.components = {
    securitySchemes,
  };

  // Montar Swagger UI en la ruta /api/docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
};

export default setupSwagger;
