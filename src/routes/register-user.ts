import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { webScrapper } from "../utils/webscrapper";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_errors/bad-request";

export async function RegisterUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          cpf: z.string().length(11),
          rg: z.string().min(8).max(11),
          gender: z.string().length(1),
          phoneNumber: z.coerce.number().min(11),
          birthDate: z.string().transform((value) => new Date(value)), // alterar o tipo
          // doctor info
          doctorName: z.string(),
          uf: z.string().length(2).toUpperCase(),
          crm: z
            .string()
            .max(7)
            .transform((value) => {
              const parsedCrm = parseInt(value);
              return parsedCrm;
            }),
          especialidade: z.string().max(25).optional(),
          areaAtuacao: z.string().max(50).optional(),
          diagnostico: z.string().min(3).max(255),
          cid: z.string().max(12),
        }),
        response: {
          201: {
            //adicionar response
          },
        },
      },
    },

    async (request, reply) => {
      const data = request.body;

      const doctorData = {
        name: data.doctorName,
        crm: data.crm,
        uf: data.uf,
      };

      const validatedData = await webScrapper(doctorData);

      if (
        validatedData === false ||
        validatedData === undefined ||
        validatedData === null
      ) {
        throw new BadRequest("Erro ao consumir os dados do site do CFM! Por favor tente novamente em alguns instantes");
      }

      console.log("Informações medicas validadas");
      console.log(validatedData);

      // verificar se o usuario já esta cadastrado

      const [userWithSameCPF, userWithSameEmail] = await Promise.all([
        prisma.user.findUnique({
          where: {
            cpf: data.cpf,
          },
        }),

        prisma.user.findUnique({
          where: {
            email: data.email,
          },
        }),
      ]);

      if (userWithSameCPF !== null) {
        throw new BadRequest("Um usuário com este CPF já está cadastrado!");
      }

      if (userWithSameEmail !== null) {
        throw new BadRequest("Um usuário com este email já está cadastrado!");
      }

      //cadatrar o usuario no banco de dados


      return reply.status(201).send("dados recebidos");
    }
  );
}
