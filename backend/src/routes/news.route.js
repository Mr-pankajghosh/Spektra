import express from "express";
import { getLocalNews } from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", getLocalNews);

export default router;
