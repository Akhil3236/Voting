import express from "express";
import { createPoll, editPoll, getAllPolls, deletePoll } from "../controllers/poll.controller.js";
import { hostauthmiddleware } from "../middleware/host.auth.js";

const router = express.Router();

router.post("/create", hostauthmiddleware, createPoll);
router.put("/edit/:id", hostauthmiddleware, editPoll);
router.get("/all", hostauthmiddleware, getAllPolls);
router.delete("/delete/:id", hostauthmiddleware, deletePoll);

export default router;

