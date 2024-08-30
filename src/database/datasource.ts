import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config();

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')], // go to folder src and pick all entities
  migrations: [join(__dirname, '..', '..', 'migrations', '*')], // go to root directory and pick all migrations file
  metadataTableName: 'migration',
  synchronize: false,
});

export default datasource;
