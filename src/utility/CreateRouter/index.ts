import express, { Router, Request, Response } from "express";

export default class CreateRouter {
  private routerBase: Router;
  public router: Router;
  private base: string;

  constructor(base: string) {
    this.routerBase = express.Router();
    this.router = express.Router();
    this.base = base;
    this.setupRoutes();
  }
  private setupRoutes(): Router {
    return this.router.use(this.base, this.routerBase);
  }

  public getApp(): Router {
    return this.routerBase;
  }
}
