# Installation

## This guide will help you to install and run the app on your local machine.

## Table of Contents <!-- omit in toc -->

- [Comfortable development (PostgreSQL + TypeORM)](#comfortable-development-postgresql--typeorm)
- [Comfortable development (MongoDB + Mongoose)](#comfortable-development-mongodb--mongoose)
- [Quick run (PostgreSQL + TypeORM)](#quick-run-postgresql--typeorm)
  - [Video guideline](#video-guideline)
- [Quick run (MongoDB + Mongoose)](#quick-run-mongodb--mongoose)
- [Links](#links)

## Comfortable development (MongoDB + Mongoose)

1. Clone repository

   ```bash
   git clone --depth 1 [https://github.com/S1mpleOW/backend-app-tutor](https://github.com/S1mpleOW/backend-app-tutor) my-app
   ```

1. Go to folder, and copy `env-example-document` as `.env`.

   ```bash
   cd my-app/
   cp env-example-document .env
   ```

1. Change `DATABASE_URL=mongodb://mongo:27017` to `DATABASE_URL=mongodb://localhost:27017`

1. Run additional container:

   ```bash
   npm run up:dev
   ```

1. Install dependency

   ```bash
   npm install
   ```

1. Run seeds

   ```bash
   npm run seed:run:document
   ```

1. Run app in dev mode

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000/docs> in your browser.

---

## Quick run (MongoDB + Mongoose)

If you want quick run your app, you can use following commands:

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/S1mpleOW/backend-app-tutor my-app
   ```

1. Go to folder, and copy `env-example-document` as `.env`.

   ```bash
   cd my-app/
   cp env-example-document .env
   ```

1. Run containers

   ```bash
   npm run up:prod
   ```

1. For check status run

   ```bash
   docker compose -f docker-compose.document.yaml logs
   ```

1. Open <http://localhost:3000/docs> or <http://127.0.0.1:3000/docs> in your browser.

---

## Links

- Swagger (API docs): <http://localhost:3000/docs> or <http://127.0.0.1:3000/docs>
- Adminer (client for DB): <http://localhost:8080>
- MongoDB Express (client for DB): <http://localhost:8081/>
- Maildev: <http://localhost:1080>

---

Previous: [Introduction](introduction.md)
