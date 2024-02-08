import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ErrorCodes, ErrorMessages } from "../models/constants";
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  InsertValuesMissingError,
  QueryFailedError,
  TypeORMError
} from "typeorm";

@Catch()
export class BeatSheetErrorHandlerInterceptor extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log(exception);
    // Handle DB errors partially
    if (
      exception instanceof QueryFailedError ||
      exception instanceof InsertValuesMissingError ||
      exception instanceof EntityNotFoundError ||
      exception instanceof EntityPropertyNotFoundError ||
      exception instanceof TypeORMError
    ) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "One or more of your parameters does not match "
      });
    }

    const message =
      ErrorMessages[exception?.status || HttpStatus.INTERNAL_SERVER_ERROR][
        exception?.response?.code || ErrorCodes.GeneralCode
      ];
    return response.status(exception.status).json({
      statusCode: exception.status,
      message
    });
  }
}
