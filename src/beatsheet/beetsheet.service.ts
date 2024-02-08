import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SaveActDto } from "./models/dtos/save-act.dto";
import { SaveBeatSheetDto } from "./models/dtos/save-beatsheet.dto";
import { BeatSheetEntity } from "../database/entities/beatsheet.entity";
import { SaveBeatDto } from "./models/dtos/save-beat.dto";
import { BeatEntity } from "../database/entities/beat.entity";
import { ActEntity } from "../database/entities/act.entity";
import { ErrorCodes } from "./models/constants";
import { ActRepository } from "../database/repositories/act.repository";
import { BeatRepository } from "../database/repositories/beat.repository";
import { BeatSheetRepository } from "../database/repositories/beatsheet.repository";
import { BeatSheetRecommendationService } from "./recommendation-engine/beatsheet-recommendation.service";

@Injectable()
export class BeatSheetService {
  constructor(
    @Inject(BeatRepository)
    private readonly beatRepository: BeatRepository,
    @Inject(ActRepository)
    private readonly actRepository: ActRepository,
    @Inject(BeatSheetRepository)
    private readonly beatSheetRepository: BeatSheetRepository,
    private beatSheetRecommendation: BeatSheetRecommendationService
  ) {}

  saveBeatSheet(saveBeatSheetDto: SaveBeatSheetDto): Promise<BeatSheetEntity> {
    return this.beatSheetRepository.upsertBeetSheet(saveBeatSheetDto);
  }

  async getBeatSheetById(id: string): Promise<BeatSheetEntity> {
    const beatSheet: BeatSheetEntity = await this.beatSheetRepository.findOne({
      where: {
        id
      },
      relations: ["beats", "beats.acts"]
    });

    if (!beatSheet) {
      throw new NotFoundException({ code: ErrorCodes.BeatSheetNotFound });
    }
    return beatSheet;
  }

  async deleteBeatSheet(id: string): Promise<void> {
    await this.beatSheetRepository.delete({ id });
  }

  getAllBeatSheets(): Promise<Partial<BeatSheetEntity[]>> {
    return this.beatSheetRepository.find();
  }

  saveBeat(saveBeatDto: SaveBeatDto): Promise<BeatEntity> {
    return this.beatRepository.upsertBeat(saveBeatDto);
  }

  async deleteBeatFromBeatSheet(beatSheetId: string, beatId: string): Promise<void> {
    await this.beatRepository
      .createQueryBuilder()
      .delete()
      .where("id = :id and beatsheet_id = :beatSheetId", { id: beatId, beatSheetId })
      .execute();
  }

  saveAct(saveActDto: SaveActDto): Promise<Partial<ActEntity>> {
    return this.actRepository.upsertAct(saveActDto);
  }

  async deleteActFromBeat(beatSheetId: string, beatId: string, actId: string): Promise<void> {
    await this.beatRepository
      .createQueryBuilder()
      .delete()
      .where("id = :id and beat_id = :beatId and beatsheet_id= :beatSheetId", { id: actId, beatSheetId, beatId })
      .execute();
  }
}
