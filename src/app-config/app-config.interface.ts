export interface AppConfig {
  servicePort: number;
  db: {
    host: string;
    port: number;
    dbName: string;
    username: string;
    password: string;
  };
}
