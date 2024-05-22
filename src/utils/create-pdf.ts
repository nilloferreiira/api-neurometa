import puppeteer ,{ PDFOptions } from 'puppeteer';

interface UserData {
  name: string;
  cpf: string;
  rg: string;
  email: string;
  gender: string;
  uf: string;
  password: string;
  birthDate: Date;
  phoneNumber: string;
  cid: string;
  diagnostico: string;
  doctorCrm: number;
  doctorName: string;
}

export async function generatePDFBuffer(data: UserData): Promise<Buffer> {
  const chromium = require('chromium');
  const browser = await puppeteer.launch({ executablePath: chromium.path, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Crie o conteúdo HTML personalizado
  const content = `
  <html>
    <head>
      <title>Aprovar cadastro usuário</title>
    </head>
    <body>
      <h1>Dados do Usuário</h1>
      <p><strong>Nome:</strong> ${data.name}</p>
      <p><strong>CPF:</strong> ${data.cpf}</p>
      <p><strong>RG:</strong> ${data.rg}</p>
      <p><strong>E-mail:</strong> ${data.email}</p>
      <p><strong>Gênero:</strong> ${data.gender}</p>
      <p><strong>UF:</strong> ${data.uf}</p>
      <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
      <p><strong>Telefone:</strong> ${data.phoneNumber}</p>
      <p><strong>CID:</strong> ${data.cid}</p>
      <p><strong>Diagnóstico:</strong> ${data.diagnostico}</p>
      <p><strong>CRM do Médico:</strong> ${data.doctorCrm}</p>
      <p><strong>Nome do Médico:</strong> ${data.doctorName}</p>
    </body>
  </html>
`;

  // Carregue o conteúdo HTML na página
  await page.setContent(content);

  // Defina as opções de impressão para gerar um PDF
  const pdfOptions: PDFOptions = {
    format: 'A4', // Formato do papel
    printBackground: true // Inclui o conteúdo da página
  };

  // Gere o PDF em um buffer
  const pdfBuffer = await page.pdf(pdfOptions);

  // Feche o navegador
  await browser.close();

  // Retorne o buffer do PDF
  return pdfBuffer;
}

