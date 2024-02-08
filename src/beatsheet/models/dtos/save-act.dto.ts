import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveActDto {
  id?: string;

  beatId?: string;

  beatSheetId?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  duration: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  cameraAngle: string;
}
