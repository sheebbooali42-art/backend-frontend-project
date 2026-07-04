import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById } from "../controllers/room.controller.js";
import { protect,authorize } from "../middleware/auth.js";


router.get("/", protect, get);
router.post("/create", protect, authorize("admin", "super_admin"), create);
router.patch("/status-update/:id", protect, authorize("admin", "super_admin"), StatusUpdate);
router.delete("/delete/:id", protect, authorize("admin", "super_admin"), deleteById);
router.get("/:id", protect, getById);

export default router