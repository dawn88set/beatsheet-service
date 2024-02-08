import { Test, TestingModule } from "@nestjs/testing";
import { SaveBeatSheetDto } from "./models/dtos/save-beatsheet.dto";
import { SaveBeatDto } from "./models/dtos/save-beat.dto";
import { SaveActDto } from "./models/dtos/save-act.dto";
import { HttpStatus, NotFoundException } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import * as request from "supertest";
import { mock, mockReset } from "jest-mock-extended";
import { BeatSheetService } from "./beetsheet.service";
import { BeatSheetController } from "./beetsheet.contoroller";

describe("BeatSheetController", () => {
  let app: NestApplication;
  const beatSheetService = mock<BeatSheetService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeatSheetController],
      providers: [BeatSheetService]
    })
      .overrideProvider(BeatSheetService) // override the dependency with the mocked version
      .useValue(beatSheetService)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });
  beforeEach(() => {
    // reset the mock before each test - this is a custom function from jest-mock-extended
    mockReset(beatSheetService);
  });
  afterAll(async () => {
    await app.close();
  });

  describe("createBeatSheet", () => {
    it("should create a new beat sheet", async () => {
      const beatSheetDto: SaveBeatSheetDto = { title: "Test Beat Sheet" };
      const createdBeatSheet: any = {
        title: "Test Beat Sheet",
      };
      beatSheetService.saveBeatSheet.mockResolvedValue(createdBeatSheet);

      const response = await request(app.getHttpServer()).post(`/beatsheet`).send(beatSheetDto).expect(HttpStatus.CREATED);

      expect(response.body).toEqual(createdBeatSheet);
    });
  });

  describe("getAllBeatSheets", () => {
    it("should return all beat sheets", async () => {
      const beatSheets: any = [
        { id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb", title: "Test Beat Sheet da18f1a0-1618-4504-a74f-1d9fc97db4cb" },
        { id: "2", title: "Test Beat Sheet 2" }
      ];
      beatSheetService.getAllBeatSheets.mockResolvedValue(beatSheets);

      const response = await request(app.getHttpServer()).get(`/beatsheet`).expect(HttpStatus.OK);

      expect(response.body).toEqual(beatSheets);
    });
  });

  describe("getBeatSheetById", () => {
    it("should return a beat sheet by ID", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatSheet: any = { id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb", title: "Test Beat Sheet" };
      beatSheetService.getBeatSheetById.mockResolvedValue(beatSheet);

      const response = await request(app.getHttpServer()).get(`/beatsheet/${beatSheetId}`).expect(HttpStatus.OK);

      expect(response.body).toEqual(beatSheet);
    });

    it("should throw NotFoundException if beat sheet not found", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      beatSheetService.getBeatSheetById.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer()).get(`/beatsheet/${beatSheetId}`).expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("updateBeatSheet", () => {
    it("should update a beat sheet", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatSheetDto: SaveBeatSheetDto = { title: "Updated Beat Sheet" };
      const updatedBeatSheet: any = { id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb", title: "Updated Beat Sheet" };
      beatSheetService.saveBeatSheet.mockResolvedValue(updatedBeatSheet);

      const response = await request(app.getHttpServer())
        .put(`/beatsheet/${beatSheetId}`)
        .send(beatSheetDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedBeatSheet);
    });
  });

  describe("addBeatToBeatSheet", () => {
    it("should add a beat to a beat sheet", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatDto: SaveBeatDto = { description: "Test Beat" };
      const addedBeat: any = { id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb", description: "Test Beat" };
      beatSheetService.saveBeat.mockResolvedValue(addedBeat);

      const response = await request(app.getHttpServer())
        .post(`/beatsheet/${beatSheetId}/beat`)
        .send(beatDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(addedBeat);
    });
  });

  describe("updateBeatInBeatSheet", () => {
    it("should update a beat in a beat sheet", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatDto: SaveBeatDto = { description: "Updated Beat" };
      const updatedBeat: any = { id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb", description: "Updated Beat" };
      beatSheetService.saveBeat.mockResolvedValue(updatedBeat);

      const response = await request(app.getHttpServer())
        .put(`/beatsheet/${beatSheetId}/beat/${beatId}`)
        .send(beatDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedBeat);
    });
  });

  describe("deleteBeatFromBeatSheet", () => {
    it("should delete a beat from a beat sheet", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";

      beatSheetService.deleteBeatFromBeatSheet.mockResolvedValue();

      await request(app.getHttpServer()).delete(`/beatsheet/${beatSheetId}/beat/${beatId}`).expect(HttpStatus.OK);
    });
  });

  describe("addActToBeat", () => {
    it("should add an act to a beat", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const actDto: SaveActDto = { description: "Test Act", duration: 1000, cameraAngle: "test angle" };
      const addedAct: any = {
        id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb",
        description: "Test Act",
        duration: 1000,
        timestamp: new Date().toDateString(),
        cameraAngle: "test angle"
      };
      beatSheetService.saveAct.mockResolvedValue(addedAct);

      const response = await request(app.getHttpServer())
        .post(`/beatsheet/${beatSheetId}/beat/${beatId}/act`)
        .send(actDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(addedAct);
    });
  });

  describe("updateActInBeat", () => {
    it("should update an act in a beat", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const actId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const actDto: SaveActDto = { description: "Update Act", duration: 1000, cameraAngle: "Update angle" };
      const updatedAct: any = {
        id: "da18f1a0-1618-4504-a74f-1d9fc97db4cb",
        description: "Test Act",
        duration: 1000,
        cameraAngle: "test angle"
      };
      beatSheetService.saveAct.mockResolvedValue(updatedAct);

      const response = await request(app.getHttpServer())
        .put(`/beatsheet/${beatSheetId}/beat/${beatId}/act/${actId}`)
        .send(actDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedAct);
    });
  });

  describe("deleteActFromBeat", () => {
    it("should delete an act from a beat", async () => {
      const beatSheetId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const beatId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      const actId = "da18f1a0-1618-4504-a74f-1d9fc97db4cb";
      beatSheetService.deleteActFromBeat.mockResolvedValue(Promise.resolve());

      await request(app.getHttpServer()).delete(`/beatsheet/${beatSheetId}/beat/${beatId}/act/${actId}`).expect(HttpStatus.OK);
    });
  });
});
