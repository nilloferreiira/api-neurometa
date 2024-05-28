# API Neurometa

## Descrição

A API Neurometa foi desenvolvida para cadastrar usuários e verificar se eles têm ou já tiveram câncer. Esse serviço é crucial, pois o recurso que esses usuários vão utilizar é gratuito para pessoas com histórico de câncer.

## Tecnologias Utilizadas

- Node.js
- Fastify
- Zod
- Fastify Type Provider Zod
- Prisma
- Puppeteer
- Nodemailer

## Como Utilizar

Para começar a utilizar a API Neurometa, siga estas etapas:

1. Clone o repositório em sua máquina local:

    ```sh
    git clone https://github.com/nilloferreiira/api-neurometa.git
    ```

2. Navegue até o diretório do projeto:

    ```sh
    cd api-neurometa
    ```

3. Instale as dependências do projeto:

    ```sh
    npm install
    ```

4. Configure o ambiente:

    Antes de criar a build da aplicação, é necessário configurar algumas variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes informações:

    ```plaintext
    # Configurações do Prisma
    DATABASE_URL=<sua_url_para_o_banco_de_dados>
    DIRECT_URL=<sua_direct_url_para_as_migrations>

    # Configurações do Nodemailer
    host=<seu_host_smtp>
    mail_port=<porta_smtp>
    user=<seu_usuario>
    pass=<sua_senha>
    emailTo=<email_de_destino>
    ```

5. Crie a build da aplicação:

    ```sh
    npm run build
    ```

6. Inicie o servidor:

    ```sh
    npm run start
    ```

7. Acesse a documentação:

    Abra o seu navegador e acesse o seguinte endereço para ver a documentação da API:

    ```sh
    https://api-neurometa.onrender.com/docs
    ```

## Documentação

A documentação da API Neurometa está disponível em [https://api-neurometa.onrender.com/docs](https://api-neurometa.onrender.com/docs). Nela, você encontrará informações detalhadas sobre todas as rotas da aplicação, incluindo o que cada rota faz e os tipos de retorno de cada uma.