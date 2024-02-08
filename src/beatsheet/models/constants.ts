import { HttpStatus } from "@nestjs/common";

export const Routes = {
  beatSheetByID: ":id",
  addBeatToBeatSheet: ":id/beat",
  beatByID: ":id/beat/:beatId",
  addActToBeat: ":id/beat/:beatId/act",
  actById: ":id/beat/:beatId/act/:actId",
};

export const ErrorCodes = {
  BeatSheetNotFound: 100,
  BadDbQuery: 23503,
  GeneralCode:1
};

export const ErrorMessages = {
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    [ErrorCodes.BadDbQuery]: "Parameters dont match, make sure all identifiers are correct",
    GeneralCode:'Something went wrong. please try again later'
  },
  [HttpStatus.NOT_FOUND]: {
    [ErrorCodes.BeatSheetNotFound]: "Could not find Beat Sheet with this identifier",
  },
};
