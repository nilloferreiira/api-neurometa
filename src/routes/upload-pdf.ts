import { z } from "zod";
import { sendEmail } from "../utils/send-email";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function uploads(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const upload = await request.file({
        limits: {
          fileSize: 5242880
        }
      });

      if(!upload) {
        return reply.status(400).send('PDF not recieved!')
      }

      const regexPDF = /^application\/pdf$/i;
      const isValidFormat = upload && regexPDF.test(upload.mimetype);

      if(!isValidFormat) {
        return reply.status(400).send('The file format is not supported! Please try .pdf')
      }

      
      const pdfFileName = upload.filename
      const pdfBuffer = await upload.toBuffer()


      const { userId } = request.params;
      
      sendEmail(userId, pdfFileName, pdfBuffer)
      
      return reply.send("Email sended");

    }
  );
}
