import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_errors/bad-request";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function Login(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/login",
      {
        schema: {
          body: z.object({
            email: z.string().email(),
            password: z.string(),       
          }),
          response: {
            201: z.object({
              token: z.string(),
            }),
          },
        },
      },
  
      async (request, reply) => {
        const { email, password } = request.body;

              const user = await prisma.user.findUnique({
                where: {
                  email,
                },
              });
        
              if (!user) {
                throw new BadRequest("Este email não esta cadastrado no sistema!");
              }
        
              const samePassword = user.password === password;
        
              if(!samePassword) {
                throw new BadRequest('Senha incorreta!')
              }
    
        const token = app.jwt.sign(
          {
            name: user.name,
            approved: user.approved
          },
          {
            sub: user.id,
            expiresIn: "30 days",
          }
        );
  
        return reply.status(201).send({ token });
      }
    );
  }
  