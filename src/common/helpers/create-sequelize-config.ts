import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/types/sequelize';
import { SqlConfig } from '../../config/sequelize/config';

export const createSequelizeConfig = (
  config: SqlConfig,
): SequelizeModuleOptions => {
  const {
    dialect,
    host,
    port,
    username,
    database,
    password,
    connectionString,
    disableSsl,
  } = config;

  return {
    ...(connectionString && { uri: connectionString }),
    ...(dialect && { dialect: dialect as Dialect }),
    ...(host && { host }),
    ...(port && { port }),
    ...(username && { username }),
    ...(database && { database }),
    ...(password && { password }),
    repositoryMode: true,
    models: [],
    autoLoadModels: true,
    dialectOptions: {
      ssl: !disableSsl
        ? {
            rejectUnauthorized: false,
          }
        : false,
    },
  };
};
