import { ApiProperty } from "@nestjs/swagger";

export class Act {

  @ApiProperty()
  id: string;

  @ApiProperty()
  beatId?: string;

  @ApiProperty()
  beatsheetId?: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  cameraAngle: string;

  @ApiProperty()
  timestamp: string;
}
