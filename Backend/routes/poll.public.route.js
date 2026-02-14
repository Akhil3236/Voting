import express from "express";
import { getPoll, vote } from "../controllers/poll.controller.js";

const router = express.Router();

router.get("/:id", getPoll);
router.post("/:id/vote", vote);

export default router;
