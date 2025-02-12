import { Router } from "express";
import { getGridController } from "./features/grid/gridController";

const router = Router();

router.get("/grid", getGridController);

export { router };
