import { Injectable } from "@nestjs/common";
import { DataSource, InsertResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Beat } from "../../beatsheet/models/interfaces/beat";
import { BeatSheetEntity } from "../entities/beatsheet.entity";
import { SaveBeatSheetDto } from "../../beatsheet/models/dtos/save-beatsheet.dto";
import { BeatEntity } from "../entities/beat.entity";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class BeatSheetRepository extends Repository<BeatSheetEntity> {
  constructor(private dataSource: DataSource) {
    super(BeatSheetEntity, dataSource.createEntityManager());
  }

  async upsertBeetSheet(saveBeatSheetDto: SaveBeatSheetDto): Promise<BeatSheetEntity> {
    return this.dataSource.transaction(async (entityManager): Promise<BeatSheetEntity> => {
      let upsertResponse: UpdateResult | InsertResult;
      if (saveBeatSheetDto.id) {
        upsertResponse = await entityManager.update(
          BeatSheetEntity,
          { id: saveBeatSheetDto.id },
          { title: saveBeatSheetDto.title }
        );
      } else {
        upsertResponse = await entityManager.insert(BeatSheetEntity, { title: saveBeatSheetDto.title });
      }

      const id = upsertResponse.generatedMaps.pop()?.id || saveBeatSheetDto?.id;
      return entityManager.findOne(BeatSheetEntity, {
        where: { id },
        relations: ["beats", "beats.acts"]
      });
    });
  }
}
