/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IQueryParams } from "../src/interfaces/common";

declare global {
  namespace Express {
    export interface Request {
      queryParams: Partial<IQueryParams>;
      user: JwtPayload;
    }
  }
}
