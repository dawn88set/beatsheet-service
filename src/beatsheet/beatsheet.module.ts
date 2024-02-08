import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { BeatSheetController } from "./beetsheet.contoroller";
import { BeatSheetService } from "./beetsheet.service";
import { DatabaseModule } from "../database/database.module";
import {
  BeatSheetErrorHandlerInterceptor
} from "./interceptors/beatsheet-error-handler.interceptor";
import { BeatSheetRecommendationService } from "./recommendation-engine/beatsheet-recommendation.service";

@Module({
  imports: [DatabaseModule],
  controllers: [BeatSheetController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: BeatSheetErrorHandlerInterceptor
    },
    BeatSheetService,
    BeatSheetRecommendationService
  ]
})
export class BeatSheetModule {}
