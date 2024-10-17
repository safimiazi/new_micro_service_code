import { logger } from "@/utility/logger";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import createError from "http-errors";

declare type WebError = Error & { status?: number };
export const errorHandler = (
  err: WebError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ title: err.name, message: err.message });
};

export const errorNotFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(createError(404));
};

type HttpStatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419
  | 420
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

export const errorCreate = (status: HttpStatusCode, message: string) => {
  return createHttpError(status, message);
};
