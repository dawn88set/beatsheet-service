import { Module } from "@nestjs/common";
import { BeatSheetModule } from "./beatsheet/beatsheet.module";
import { DatabaseModule } from "./database/database.module";
import { AppConfigModule } from "./app-config/app-config.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

@Module({
  imports: [BeatSheetModule, AppConfigModule]
})
export class AppModule {
}
