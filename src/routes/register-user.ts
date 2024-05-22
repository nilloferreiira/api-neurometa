import { ZodTypeProvider } from "fastify-type-provider-zod";
import { webScrapper } from "../utils/webscrapper";
import { BadRequest } from "./_errors/bad-request";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { sendEmail } from "../utils/send-email";
import { generatePDFBuffer } from "../utils/create-pdf";

export async function RegisterUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          cpf: z
            .string()
            .regex(
              /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              "Por facor, use um CPF válido!"
            ),
          rg: z
            .string()
            .regex(/^\d{3}\.\d{3}-\d$/, "Por facor, use um RG válido!"),
          gender: z.string().length(1),
          phoneNumber: z.string().length(11),
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
          201: z.object({
            201: z.string(),
          }),
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

      // verifica se o CRM já esta cadastrado!
      const doctorAlreadyRegistered = await prisma.doctor.findUnique({
        where: {
          crm: doctorData.crm,
        },
      });

      if (doctorAlreadyRegistered === null) {
        const validatedData = await webScrapper(doctorData);
        if (
          validatedData === false ||
          validatedData === undefined ||
          validatedData === null
        ) {
          throw new BadRequest(
            "Erro ao consumir os dados do site do CFM! Por favor tente novamente em alguns instantes"
          );
        }

        console.log("Informações medicas validadas");

        await prisma.doctor.create({
          data: {
            crm: doctorData.crm,
            name: doctorData.name,
          },
        });
      }

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
      const user = await prisma.user.create({
        data: {
          name: data.name,
          cpf: data.cpf,
          rg: data.rg,
          email: data.email,
          gender: data.gender,
          uf: data.uf,
          password: data.password,
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber,
          cid: data.cid,
          diagnostico: data.diagnostico,
          doctorCrm: data.crm,
          doctorName: data.doctorName,
        },
      });

      // criar o pdf
      const fileName = `cadastro_${user.name}.pdf`;
      generatePDFBuffer(user)
        .then((pdfBuffer) => {
          sendEmail(user.id, fileName, pdfBuffer);
          console.log("PDF gerado com sucesso.");
        })
        .catch((error) => {
          console.error("Ocorreu um erro ao gerar o PDF:", error);
        });

      return reply
        .status(201)
        .send({ 201: "Usuário pré cadastrado com sucesso!" });
    }
  );
}
