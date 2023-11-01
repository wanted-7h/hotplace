import { Router } from "express";
import { hello } from "./test.service";

const router = Router();

router.get("/", hello);

export default router;
