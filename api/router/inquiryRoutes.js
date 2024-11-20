import express from "express";
import {
  getInquiries,
  createInquiry,
  deleteInquiry,
  getInquiryById,
  updateInquiry,
} from "../controller/inquiryController.js";

const router = express.Router();

router.get("/", getInquiries);
router.get("/:id", getInquiryById);
router.post("/", createInquiry);
router.put("/:id", updateInquiry);
router.delete("/:id", deleteInquiry);

export default router;
