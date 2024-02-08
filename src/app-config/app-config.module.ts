import { Module } from "@nestjs/common";
import { AppConfigService } from "./app-config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
