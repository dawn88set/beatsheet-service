import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BeatSheetEntity } from "./entities/beatsheet.entity";
import { BeatEntity } from "./entities/beat.entity";
import { ActEntity } from "./entities/act.entity";
import { AppConfigModule } from "../app-config/app-config.module";
import { AppConfigService } from "../app-config/app-config.service";
import { ActRepository } from "./repositories/act.repository";
import { BeatRepository } from "./repositories/beat.repository";
import { BeatSheetRepository } from "./repositories/beatsheet.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        type: "postgres",
        host: configService.config.db.host,
        port: configService.config.db.port,
        username: configService.config.db.username,
        password: configService.config.db.password,
        database: configService.config.db.dbName,
        entities: [BeatSheetEntity, BeatEntity, ActEntity],
        synchronize: true,
      })
    })
  ],
  providers: [ActRepository, BeatRepository, BeatSheetRepository],
  exports: [ActRepository, BeatRepository, BeatSheetRepository]
})
export class DatabaseModule {}
