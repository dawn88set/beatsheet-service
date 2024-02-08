import { Injectable } from "@nestjs/common";
import { AppConfig } from "./app-config.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get config(): AppConfig {
    return {
      servicePort: this.configService.get<number>("SERVICE_PORT") || 3000,
      db: {
        username: this.configService.get<string>("DB_USERNAME"),
        password: this.configService.get<string>("DB_PASSWORD"),
        dbName: this.configService.get<string>("DB_NAME"),
        host: this.configService.get<string>("DB_HOST"),
        port: this.configService.get<number>("DB_PORT")
      }
    };
  }
}
