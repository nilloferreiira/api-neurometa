import fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { Approve } from "./routes/approve";
import { errorHandler } from "./error-handler";
import { RegisterUser } from "./routes/register-user";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: true,
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "API Neurometa",
      description: "API de validação de cadastro para plataforma da neurometa.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(RegisterUser);
app.register(Approve);

app.setErrorHandler(errorHandler);

app.get("/", async () => {
  return "Hello";
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
  })
  .then(() => {
    console.log("Http server running!");
  });
