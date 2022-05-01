import { Router } from "express";
import { Manager } from "./manager"

export abstract class BaseController {
  public abstract route_path: string;
  public abstract route: Router;
  public manager!: Manager | undefined;

  public abstract startRouter(): Router;
}