import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import axios from 'axios';
import { sendEmail } from '../utils/send-email';

export async function Approve(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/approve/:userId",
    {
      schema: {
        summary: "Aprovação de cadastro.",
        description:
          "Link que é enviado por email para o administrador e, quando clicado, aprova o cadastro do usuário, trocando seu status no banco de dados para aprovado e, assim, fazendo uma requisição de cadastro no sistema da plataforma.",
        tags: ["aprovar cadastro"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user === null) {
        throw new Error("User not found.");
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          approved: true,
        },
      });

            try {
                const medicalReport = user.medicalReport === null ? "Zm90b3JndmVyc28=" : user.medicalReport

                const backendResponse = await axios.post("https://neurometaoncoapi.azurewebsites.net/RegisterUser", {
                    registerUser: {
                        email: user.email,
                        password: user.password,
                        nome: user.name,
                        passwordConfirmation: user.password,
                        agreeTerms: true,
                        enderecoCompleto: "endereço completo",
                        role: "Paciente",
                        fotoPerfil: null,
                        telefone: user.phoneNumber,
                        cpf: user.cpf,
                        rg: user.rg
                      },
                      paciente: {
                        fotoRgFrente: "Zm90b3JndmVyc28=",
                        fotoRgVerso: "Zm90b3JndmVyc28=",
                        comprovanteResidencia: "Zm90b3JndmVyc28=",
                        relatorioMedico: medicalReport,
                        pdfFormatado: "Zm90b3JndmVyc28=",
                        crmMedico: user.doctorCrm,
                        nomeMedico: user.doctorName,
                        cid: user.cid,
                        ufCrm: user.uf
                      }
                })

                if(!backendResponse) {
                    throw new Error("Erro ao cadastrar o usuário no banco de dados do sistema.")
                }

                sendEmail({userId: user.id, userEmail: user.email, pdfFileName: null, pdfBuffer: null, medicalReportInBase64: null })
            } catch(e) {
                console.log(e)
                throw new Error("Erro interno do servidor.")
            }

      return reply
        .status(204)
        .send({ message: "Usuário aprovado com sucesso!" });
    }
  );
}
