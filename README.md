# plann.er

O projeto plann.er é uma aplicação desenvolvida durante a Next Level Week da [Rocketseat](https://app.rocketseat.com.br/) um evento de programação prática que acontece algumas vezes por ano, oferecendo uma semana de aulas. Cada edição tem um tema e desafio diferentes, proporcionando sempre algo novo para aprender e evoluir na programação.

O projeto atual, chamado Planner, é um planejador de viagens onde os usuários podem convidar participantes e gerenciar viagens.

## 💾 Diagrama ERD

<img src="https://i.imgur.com/zhXvSph.png" width="1920"/>

## 🚀 Início

Estas instruções permitirão que você obtenha uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/en)
- Um IDE como [Visual Studio Code](https://code.visualstudio.com/Download) (opcional, mas recomendado)

### 🔧 Instalação

Siga os passos abaixo para configurar e executar o projeto localmente:

```bash
# Clone o repositório
$ git clone https://github.com/GabrielFeijo/NLW-Journey-Backend
```

```bash
# Acesse a pasta do projeto em terminal/cmd
$ cd NLW-Journey-Backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env
DATABASE_URL="file:./db/dev.db"
API_BASE_URL="http://localhost:3333"
FRONTEND_BASE_URL="http://localhost:3000"
PORT="3333"

# Execute as migrações do Prisma para configurar o banco de dados
$ npx prisma migrate dev

# Inicie a aplicação em DEV:
$ npm run dev
```

## 🛠️ Feito utilizando

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg" width="40" height="45" />
