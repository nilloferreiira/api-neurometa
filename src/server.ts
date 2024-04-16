import fastify from "fastify";
import { RegisterUser } from "./routes/register-user";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';


const app = fastify();
// fastifyCors

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(RegisterUser)

app.get('/', async () => {
    return 'Hello'
})

app.listen({
    port: 3333
}).then(() => {
    console.log('Http server running!')
})