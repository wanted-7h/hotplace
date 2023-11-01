export type DBConfig = {
  database: string;
  username: string;
  password: string | null | undefined;
  host: string;
};

export interface Config {
  [env: string]: DBConfig;
}
