import  { z } from 'zod'
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';

export async function Approve(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/approve/:userId", 
        {
            schema: {
                params: z.object({
                    userId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                    })
                } 
            }
        }, 
        async (request, reply) => {
            const { userId } = request.params

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                }
            })

            if(user === null) {
                throw new Error('User not found.')
            }

            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    approved: true,
                }
            })

            return reply.status(204).send({ message: 'Usuário aprovado com sucesso!' })
        });
}