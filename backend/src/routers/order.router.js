import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";
import { place, read, verifyPayment } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";

router.post("/place", protect, place);
router.get("/", protect, read);
router.post("/verify", protect, verifyPayment);

export default router