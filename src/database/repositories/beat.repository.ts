import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, InsertResult, Repository } from "typeorm";
import { ActEntity } from "../entities/act.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SaveActDto } from "../../beatsheet/models/dtos/save-act.dto";
import { Beat } from "../../beatsheet/models/interfaces/beat";
import { BeatEntity } from "../entities/beat.entity";
import { SaveBeatDto } from "../../beatsheet/models/dtos/save-beat.dto";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class BeatRepository extends Repository<BeatEntity> {
  constructor(private dataSource: DataSource) {
    super(BeatEntity, dataSource.createEntityManager());
  }

  async upsertBeat(saveBeatDto: SaveBeatDto): Promise<BeatEntity> {
    return this.dataSource.transaction(async (entityManager) => {
      let upsertResponse: UpdateResult | InsertResult;
      if (saveBeatDto.id) {
        upsertResponse = await entityManager.update(
          BeatEntity,
          { id: saveBeatDto.id, beatSheet: { id: saveBeatDto.beatSheetId } },
          { description: saveBeatDto.description }
        );
      } else {
        upsertResponse = await entityManager.insert(BeatEntity, {
          description: saveBeatDto.description,
          beatSheet: { id: saveBeatDto.beatSheetId }
        });
      }
      const id = upsertResponse.generatedMaps.pop()?.id || saveBeatDto?.id;
      return entityManager.findOne(BeatEntity, {
        where: { id },
        relationLoadStrategy: "join"
      });
    });
  }
}
