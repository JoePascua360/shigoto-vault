import { Pool } from "pg";
import { GlobalConfigs } from "~/config/global-config";
/**
 * @param {number} port - port of postgres image in compose.yaml
 */
export const pool = new Pool({
  user: GlobalConfigs.dbConfig.DB_USER,
  password: GlobalConfigs.dbConfig.DB_PASSWORD,
  host: GlobalConfigs.dbConfig.DB_HOST,
  port: GlobalConfigs.dbConfig.DB_PORT,
  database: GlobalConfigs.dbConfig.DB_NAME,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};
