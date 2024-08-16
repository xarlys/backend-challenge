
# 🛠️ Teste para Backender Kolab

Este projeto é uma API desenvolvida com NestJS, utilizando Typescript, TypeORM e Swagger. A API implementa funcionalidades de autenticação com JWT e Cookies e oferece um CRUD completo de usuários de uma empresa, além de um endpoint para listar toda a árvore de funcionários seguindo uma hierarquia.

## 🚀 Começando

Essas instruções irão ajudá-lo a obter uma cópia do projeto rodando localmente para desenvolvimento e testes.

### 📋 Pré-requisitos

Você precisará dos seguintes softwares instalados:

- **[Node.js](https://nodejs.org/en/download/)** - Plataforma de execução para o JavaScript/TypeScript.
- **[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)** ou **Npm** - Gerenciadores de pacotes.
- **[PostgreSQL](https://www.postgresql.org/download/)** ou outro banco de dados compatível.
- **[Visual Studio Code](https://code.visualstudio.com/download)** (opcional) - Editor de código recomendado.

### 🔧 Instalação

Passos para rodar o projeto em sua máquina local:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/xarlys/kolab-backend.git
   ```

2. **Instale as dependências**:

   ```bash
   cd kolab-backend
   yarn install
   # ou se você preferir npm:
   npm install
   ```

3. **Configure as variáveis de ambiente**:

   Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

   ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=user
    DATABASE_PASSWORD=pass
    DATABASE_NAME=database-name
    NODE_ENV=development npm run start
   ```

   Certifique-se de ajustar `usuario`, `senha`, e `nome_do_banco` conforme sua configuração local de banco de dados.

4. **Rode as migrations para criar as tabelas**:

   ```bash
   yarn typeorm migration:run
   # ou
   npm run typeorm migration:run
   ```

5. **Inicie o servidor**:

   ```bash
   yarn start:dev
   # ou
   npm run start:dev
   ```

6. **Acesse a documentação Swagger**:

   Abra o navegador e acesse:

   ```
   http://localhost:3000/documentation
   ```

   O Swagger será usado para interagir com os endpoints da API.

### 🛠️ Funcionalidades

A API oferece as seguintes funcionalidades:

- **CRUD de usuários**: Cadastramento, edição, visualização e exclusão de usuários de uma empresa.
- **Autenticação JWT**: Login, logout e endpoints protegidos com JWT e cookies.
- **Hierarquia de funcionários**: Endpoint que retorna a árvore de funcionários da empresa com base no campo `parentUserId`, exibindo a hierarquia.

### 🔐 Autenticação

A autenticação é feita via JWT e Cookies. Aqui está o passo a passo:

1. **Realize o login**:

   Utilize o endpoint `/auth/login` no Swagger, enviando `username` e `password`. Se as credenciais estiverem corretas, você receberá um token JWT e ele será armazenado em um cookie chamado `jwt`.

2. **Acesse os endpoints protegidos**:

   Para acessar os endpoints que exigem autenticação, o token JWT armazenado no cookie `jwt` será automaticamente utilizado.

3. **Logout**:

   O endpoint `/auth/logout` invalidará o cookie e você será deslogado.

### 🔧 Endpoints

Alguns dos principais endpoints oferecidos:

- **POST /auth/login**: Realiza o login do usuário e retorna o token JWT.
- **POST /auth/logout**: Desloga o usuário e invalida o token JWT.
- **POST /users**: Cria um novo usuário.
- **GET /users/tree**: Retorna a árvore de funcionários com base no campo `parentUserId`.
- **GET /users/:id**: Retorna as informações de um usuário específico.
- **PATCH /users/:id**: Atualiza as informações de um usuário.
- **DELETE /users/:id**: Exclui um usuário.

### 🚀 Tecnologias Utilizadas

As seguintes tecnologias foram utilizadas no desenvolvimento deste projeto:

- **NestJS**: Framework para desenvolvimento de aplicações Node.js.
- **TypeScript**: Linguagem de tipagem estática desenvolvida sobre o JavaScript.
- **TypeORM**: ORM para o banco de dados, permitindo manipulação dos dados.
- **Swagger**: Documentação e teste de API.
- **JWT**: Autenticação via token.
- **bcrypt**: Criptografia para senhas.
- **PostgreSQL**: Banco de dados relacional.
- **dotenv**: Para gerenciar as variáveis de ambiente.
- **Cookie-parser**: Para manipulação de cookies HTTP.

### 🛠️ Desenvolvimento e Testes

O projeto foi estruturado para desenvolvimento e testes contínuos. Utilize o seguinte comando para rodar os testes:

```bash
yarn test
# ou
npm run test
```

Os testes cobrem as principais funcionalidades, incluindo autenticação e CRUD de usuários.

## 🛠️ TO-DO:
[ ] - workspace NX - pacote user
[ ] - workspace NX - pacote auth
[ ] - workspace NX - lib authenticated
[ ] - serverless-offline.

## ✒️ Autor

* **Xarlys Souza** - *Versão Inicial* - [GitHub](https://github.com/xarlys)

## 🎁 Expressões de Gratidão

* Obrigado por dedicar seu tempo para revisar e testar o projeto. Sinta-se à vontade para entrar em contato!

---

⌨️ com ❤️ por [Xarlys Souza](https://github.com/xarlys) 😊

---

### Possíveis Melhorias

1. **Melhoria na gestão de cookies**: Adicionar mais segurança nos cookies em ambiente de produção (`secure: true`, `sameSite`).
2. **Rate Limiting**: Adicionar rate-limiting para proteção contra ataques de força bruta.
