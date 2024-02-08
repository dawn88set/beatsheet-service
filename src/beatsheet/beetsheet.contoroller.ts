import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe
} from "@nestjs/common";
import { Routes } from "./models/constants";
import { BeatSheetService } from "./beetsheet.service";
import { SaveActDto } from "./models/dtos/save-act.dto";
import { Beat } from "./models/interfaces/beat";
import { SaveBeatDto } from "./models/dtos/save-beat.dto";
import { SaveBeatSheetDto } from "./models/dtos/save-beatsheet.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BeatEntity } from "../database/entities/beat.entity";
import { BeatSheetEntity } from "../database/entities/beatsheet.entity";

@Controller("beatsheet")
@UsePipes(new ValidationPipe({ transform: true }))
export class BeatSheetController {
  constructor(private readonly beatSheetService: BeatSheetService) {}

  /**
   * Create a new beat sheet.
   * @param saveBeatSheetDto
   * @returns The newly created beat sheet.
   */
  @Post()
  @ApiOperation({ summary: "Create a new beat sheet" })
  @ApiBody({ type: SaveBeatSheetDto })
  @ApiResponse({ status: 201, description: "The newly created beat sheet", type: SaveBeatSheetDto })
  createBeatSheet(@Body() saveBeatSheetDto: SaveBeatSheetDto): Promise<BeatSheetEntity> {
    return this.beatSheetService.saveBeatSheet(saveBeatSheetDto);
  }

  /**
   * Get all beat sheets.
   * @returns An array of all beat sheets.
   */
  @Get()
  @ApiOperation({ summary: "Get all beat sheets" })
  @ApiResponse({ status: 200, description: "An array of all beat sheets", type: [SaveBeatSheetDto] })
  getAllBeatSheets() {
    return this.beatSheetService.getAllBeatSheets();
  }

  /**
   * Get a beat sheet by ID.
   * @param id The ID of the beat sheet to retrieve.
   * @returns The beat sheet with the specified ID including beats and acts.
   */
  @Get(Routes.beatSheetByID)
  @ApiOperation({ summary: "Get a beat sheet by ID" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet to retrieve", type: "string", format: "uuid" })
  @ApiResponse({
    status: 200,
    description: "The beat sheet with the specified ID including beats and acts",
    type: SaveBeatSheetDto
  })
  getBeatSheetById(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.beatSheetService.getBeatSheetById(id);
  }

  /**
   * Update a beat sheet by ID.
   * @param id The ID of the beat sheet to update.
   * @param saveBeatSheetDto
   * @returns The updated beat sheet.
   */
  @Put(Routes.beatSheetByID)
  @ApiOperation({ summary: "Update a beat sheet by ID" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet to update", type: "string", format: "uuid" })
  @ApiBody({ type: SaveBeatSheetDto })
  @ApiResponse({ status: 200, description: "The updated beat sheet", type: SaveBeatSheetDto })
  updateBeatSheet(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() saveBeatSheetDto: SaveBeatSheetDto
  ) {
    return this.beatSheetService.saveBeatSheet({ id, ...saveBeatSheetDto });
  }

  /**
   * Delete a beat sheet by ID.
   * @param id The ID of the beat sheet to delete.
   * @returns The deleted beat sheet.
   */
  @Delete(Routes.beatSheetByID)
  @ApiOperation({ summary: "Delete a beat sheet by ID" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet to delete", type: "string", format: "uuid" })
  @ApiResponse({ status: 200, description: "The deleted beat sheet" })
  deleteBeatSheet(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.beatSheetService.deleteBeatSheet(id);
  }

  /**
   * Add a beat to a specific beat sheet.
   * @param id The ID of the beat sheet to add the beat to.
   * @param beatDto The data of the beat to add.
   * @returns The added beat.
   */
  @Post(Routes.addBeatToBeatSheet)
  @ApiOperation({ summary: "Add a beat to a specific beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet to add the beat to", type: "string", format: "uuid" })
  @ApiBody({ type: SaveBeatDto })
  @ApiResponse({ status: 201, description: "The added beat", type: Beat })
  addBeatToBeatSheet(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() beatDto: SaveBeatDto
  ): Promise<BeatEntity> {
    return this.beatSheetService.saveBeat({ beatSheetId: id, ...beatDto });
  }

  /**
   * Update a beat in a specific beat sheet.
   * @param id The ID of the beat sheet.
   * @param beatId The ID of the beat to update.
   * @param beatDto The data to update the beat with.
   * @returns The updated beat.
   */
  @Put(Routes.beatByID)
  @ApiOperation({ summary: "Update a beat in a specific beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet", type: "string", format: "uuid" })
  @ApiParam({ name: "beatId", description: "The ID of the beat to update", type: "string", format: "uuid" })
  @ApiBody({ type: SaveBeatDto })
  @ApiResponse({ status: 200, description: "The updated beat", type: Beat })
  updateBeatInBeatSheet(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Param("beatId", new ParseUUIDPipe({ version: "4" })) beatId: string,
    @Body() beatDto: SaveBeatDto
  ): Promise<BeatEntity> {
    return this.beatSheetService.saveBeat({ beatSheetId: id, id: beatId, ...beatDto });
  }

  /**
   * Delete a beat from a specific beat sheet.
   * @param id The ID of the beat sheet.
   * @param beatId The ID of the beat to delete.
   * @returns The deleted beat.
   */
  @Delete(Routes.beatByID)
  @ApiOperation({ summary: "Delete a beat from a specific beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet", type: "string", format: "uuid" })
  @ApiParam({ name: "beatId", description: "The ID of the beat to delete", type: "string", format: "uuid" })
  @ApiResponse({ status: 200, description: "The deleted beat" })
  deleteBeatFromBeatSheet(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Param("beatId", new ParseUUIDPipe({ version: "4" })) beatId: string
  ) {
    return this.beatSheetService.deleteBeatFromBeatSheet(id, beatId);
  }

  /**
   * Add an act to a specific beat in a beat sheet.
   * @param id The ID of the beat sheet.
   * @param beatId The ID of the beat to add the act to.
   * @param actDto The data of the act to add.
   * @returns The added act.
   */
  @Post(Routes.addActToBeat)
  @ApiOperation({ summary: "Add an act to a specific beat in a beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet", type: "string", format: "uuid" })
  @ApiParam({ name: "beatId", description: "The ID of the beat to add the act to", type: "string", format: "uuid" })
  @ApiBody({ type: SaveActDto })
  @ApiResponse({ status: 201, description: "The added act" })
  addActToBeat(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Param("beatId", new ParseUUIDPipe({ version: "4" })) beatId: string,
    @Body() actDto: SaveActDto
  ) {
    return this.beatSheetService.saveAct({ beatSheetId: id, beatId, ...actDto });
  }

  /**
   * Update an act in a specific beat in a beat sheet.
   * @param id The ID of the beat sheet.
   * @param beatId The ID of the beat containing the act.
   * @param actId The ID of the act to update.
   * @param actDto The data to update the act with.
   * @returns The updated act.
   */
  @Put(Routes.actById)
  @ApiOperation({ summary: "Update an act in a specific beat in a beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet", type: "string", format: "uuid" })
  @ApiParam({ name: "beatId", description: "The ID of the beat containing the act", type: "string", format: "uuid" })
  @ApiParam({ name: "actId", description: "The ID of the act to update", type: "string", format: "uuid" })
  @ApiBody({ type: SaveActDto })
  @ApiResponse({ status: 200, description: "The updated act" })
  updateActInBeat(
    @Param("id") id: string,
    @Param("beatId") beatId: string,
    @Param("actId") actId: string,
    @Body() actDto: SaveActDto
  ) {
    return this.beatSheetService.saveAct({ id: actId, beatSheetId: id, beatId, ...actDto });
  }

  /**
   * Delete an act from a specific beat in a beat sheet.
   * @param id The ID of the beat sheet.
   * @param beatId The ID of the beat.
   * @param actId The ID of the act to delete.
   * @returns The deleted act.
   */
  @Delete(Routes.actById)
  @ApiOperation({ summary: "Delete an act from a specific beat in a beat sheet" })
  @ApiParam({ name: "id", description: "The ID of the beat sheet", type: "string", format: "uuid" })
  @ApiParam({ name: "beatId", description: "The ID of the beat", type: "string", format: "uuid" })
  @ApiParam({ name: "actId", description: "The ID of the act to delete", type: "string", format: "uuid" })
  @ApiResponse({ status: 200, description: "The deleted act" })
  deleteActFromBeat(@Param("id") id: string, @Param("beatId") beatId: string, @Param("actId") actId: string) {
    return this.beatSheetService.deleteActFromBeat(id, beatId, actId);
  }
}
