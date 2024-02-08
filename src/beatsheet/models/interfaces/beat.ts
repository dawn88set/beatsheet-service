import { Act } from "./act";
import { ApiProperty } from "@nestjs/swagger";

export class Beat {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  acts: Act[];

  @ApiProperty()
  beatsheetId: string;

  @ApiProperty()
  timestamp: string;
}
