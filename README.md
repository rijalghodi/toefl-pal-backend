# 🖊️ TOEFL Pal

The Best Online TOEFL Test Simulation

## Tech Stack

- **Package Manager:** Yarn
- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Caching:** Redis
- **Linting:** ESLint + Prettier

## Development

- **Environment Variables:** Define environment variables in a `.env` file.
- **Available Commands:**
  - `yarn dev`: Run in development mode. Restarts the app on changes.
  - `yarn start`: Run the app without automatic restarts.
  - `yarn build`: Build the app for production.
  - `yarn format`: Format code using Prettier.
  - `yarn lint`: Fix code formatting issues using ESLint.
  - `yarn migrate:create <path-to-migration-file>`: Create a new migration file at the specified path.
  - `yarn migrate:gen <path-to-migration-file>`: Generate a migration file based on the current database schema.
  - `yarn migrate:run`: Run pending migrations.
