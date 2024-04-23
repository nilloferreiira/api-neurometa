import fastify from "fastify";
import { Approve } from "./routes/approve";
import { uploads } from "./utils/upload-pdf";
import multipart from "@fastify/multipart"
import { errorHandler } from "./error-handler";
import { RegisterUser } from "./routes/register-user";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';


const app = fastify();
// fastifyCors

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(multipart)
app.register(RegisterUser)
app.register(uploads)
app.register(Approve)

// app.setErrorHandler(errorHandler)

app.get('/', async () => {
    return 'Hello'
})

app.listen({
    port: 3333
}).then(() => {
    console.log('Http server running!')
})