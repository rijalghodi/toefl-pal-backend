import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')], // go to folder src and pick all entities
  migrations: [join(__dirname, 'migration', '*')], // go to database directory and pick all migrations file
  factories: ['src/**/*.factory.{ts,js}'],
  seeds: ['src/**/*.seeder.{ts,js}'],
  metadataTableName: 'migration',
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
};

const datasource = new DataSource(dataSourceOptions);

export default datasource;
