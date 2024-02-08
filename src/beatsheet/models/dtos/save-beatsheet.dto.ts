import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveBeatSheetDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;
}
