import nodemailer from "nodemailer";

export function sendEmail(userid: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "arcanumchronicles2@gmail.com",
      pass: "omne ydru gfcs aynk",
    },
  });

  // const html = `<div><h1>Por favor verifique se este documento é verídico.</h1><br/><img src=""><br/><p>Caso seja esteja tudo certo, clique no link abaixo para aprovar o cadastro do usuário</p><br/><a href="">Aprovar</a></div>`

  const html = `<div>
                    <h1>Por favor verifique se este documento é verídico.</h1>
                    <br/>
                    <img src="">
                    <br/>
                    <p>Caso seja esteja tudo certo, clique no link abaixo para aprovar o cadastro do usuário</p><br/>
                    <a href="http://localhost:3333/approve/${userid}">Aprovar</a>
                   </div>`;

  transporter
    .sendMail({
      from: "Administrador <arcanumchronicles2@gmail.com>",
      to: "nilloferreiira@gmail.com",
      subject: "Approve user register",
      html: html,
    })
    .then(() => console.log("Email enviado."))
    .catch(() => console.log("Ocorreu algum erro e o email não foi enviado."));
}

sendEmail('5301a6d2-e6cd-4f31-82f7-649243992438')