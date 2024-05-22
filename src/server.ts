import fastify from "fastify";
import cors from '@fastify/cors'
import { Approve } from "./routes/approve";
import { errorHandler } from "./error-handler";
import { RegisterUser } from "./routes/register-user";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
    origin: true
})

app.register(RegisterUser)
app.register(Approve)


app.setErrorHandler(errorHandler)

app.get('/', async () => {
    return 'Hello'
})

app.listen({
    host: "0.0.0.0", 
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
}).then(() => {
    console.log('Http server running!')
})