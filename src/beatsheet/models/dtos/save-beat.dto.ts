import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveBeatDto {
  id?: string;

  beatSheetId?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
