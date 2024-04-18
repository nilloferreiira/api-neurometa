import fastify from "fastify";
import { errorHandler } from "./error-handler";
import { RegisterUser } from "./routes/register-user";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';


const app = fastify();
// fastifyCors

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(RegisterUser)

app.setErrorHandler(errorHandler)

app.get('/', async () => {
    return 'Hello'
})

app.listen({
    port: 3333
}).then(() => {
    console.log('Http server running!')
})