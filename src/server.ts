import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from '@fastify/cors'
import multipart from "@fastify/multipart"
import { Approve } from "./routes/approve";
import { uploads } from "./routes/upload-pdf";
import { errorHandler } from "./error-handler";
import { RegisterUser } from "./routes/register-user";
import { Login } from "./routes/login";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
    origin: true
})


app.register(jwt, {
    secret: 'neurometa_secret'
})

app.register(multipart)
app.register(RegisterUser)
app.register(Login)
app.register(uploads)
app.register(Approve)


app.setErrorHandler(errorHandler)

app.get('/', async () => {
    return 'Hello'
})

app.listen({
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
}).then(() => {
    console.log('Http server running!')
})