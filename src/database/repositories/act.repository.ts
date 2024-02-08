import { Injectable } from "@nestjs/common";
import { DataSource, InsertResult, Repository } from "typeorm";
import { ActEntity } from "../entities/act.entity";
import { SaveActDto } from "../../beatsheet/models/dtos/save-act.dto";
import { Beat } from "../../beatsheet/models/interfaces/beat";
import { BeatEntity } from "../entities/beat.entity";
import { Act } from "../../beatsheet/models/interfaces/act";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { BeatSheetEntity } from "../entities/beatsheet.entity";

@Injectable()
export class ActRepository extends Repository<ActEntity> {
  constructor(private dataSource: DataSource) {
    super(ActEntity, dataSource.createEntityManager());
  }

  async upsertAct(saveActDto: SaveActDto): Promise<ActEntity> {
    return this.dataSource.transaction(async (entityManager) => {
      let upsertResponse: UpdateResult | InsertResult;
      if (saveActDto.id) {
        upsertResponse = await entityManager.update(
          ActEntity,
          { id: saveActDto.id, beatsheet: { id: saveActDto.beatSheetId }, beat: { id: saveActDto.beatId } },
          { description: saveActDto.description, duration: saveActDto.duration, cameraAngle: saveActDto.cameraAngle }
        );
      } else {
        upsertResponse = await entityManager.insert(ActEntity, {
          description: saveActDto.description,
          duration: saveActDto.duration,
          cameraAngle: saveActDto.cameraAngle,
          beat: { id: saveActDto.beatId },
          beatSheet: { id: saveActDto.beatSheetId }
        });
      }
      const id = upsertResponse.generatedMaps.pop()?.id || saveActDto?.id;
      return entityManager.findOne(ActEntity, {
        where: { id },
        relationLoadStrategy: "join"
      });
    });
  }
}
