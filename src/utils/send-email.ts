import nodemailer from "nodemailer";
import { z } from "zod";
import "dotenv/config";
import { Attachment } from "nodemailer/lib/mailer";

const sendEmailSchema = z.object({
  userId: z.string().uuid(),
  userEmail: z.string().email().optional().nullable().default(null),
  pdfFileName: z.string().optional().nullable().default(null),
  pdfBuffer: z.any().optional().nullable().default(null),
  medicalReportInBase64: z.string().optional().nullable().default(null),
});

type SendEmailProps = z.infer<typeof sendEmailSchema>;

// interface SendEmailProps {
//   userid: string;
//   userEmail?: string;
//   message?: string;
//   pdfFileName?: string;
//   pdfBuffer?: any;
//   medicalReportInBase64?: string;
// }

export function sendEmail({
  userId,
  userEmail,
  pdfFileName,
  pdfBuffer,
  medicalReportInBase64,
}: SendEmailProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.host,
    port: Number(process.env.mail_port),
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  const html = `<div>
                    <h1>Por favor verifique se este documento é verídico.</h1>
                    <br/>
                    <img src="">
                    <br/>
                    <p>Caso seja esteja tudo certo, clique no link abaixo para aprovar o cadastro do usuário</p><br/>
                    <a href="https://api-neurometa.onrender.com/approve/${userId}">Aprovar</a>
                   </div>`;

  if (pdfFileName !== null && pdfBuffer !== null) {
    const adminMailOptions: {
      from: string;
      to: string;
      subject: string;
      html: string;
      attachments: Attachment[];
    } = {
      from: "API de cadastro dos usuários da neurometa <arcanumchronicles2@gmail.com>",
      to: process.env.emailTo!,
      subject: "Approve user register",
      html: html,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer,
        },
        {
          filename: "relatiorio medico.jpg",
          content: medicalReportInBase64!,
          encoding: "base64",
        },
      ],
    };
    transporter
      .sendMail(adminMailOptions)
      .then(() => console.log("Email para o administrador enviado."))
      .catch(() =>
        console.log("Ocorreu algum erro e o email não foi enviado.")
      );
  } else {
    const userMailOptions = {
      from: "Neurometa <arcanumchronicles2@gmail.com>",
      to: userEmail !== null ? userEmail : process.env.emailTo,
      subject: "Registration approved",
      text: "Seu cadastro foi aprovado! Seu acesso a plataforma foi liberado.",
    };

    transporter
      .sendMail(userMailOptions)
      .then(() => console.log("Email enviado."))
      .catch(() =>
        console.log("Ocorreu algum erro e o email não foi enviado.")
      );
  }
}
