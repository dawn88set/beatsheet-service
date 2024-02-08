import { Beat } from "./beat";
import { ApiProperty } from "@nestjs/swagger";

export class BeatSheet {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  beats?: Beat[];

  @ApiProperty()
  timestamp: string;
}
