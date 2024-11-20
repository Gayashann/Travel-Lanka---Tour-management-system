import express from "express";
import {
  addFinance,
  deleteFinance,
  getAllFinance,
  getFinanceById,
  updateFinance,
} from "../controller/financeConteroller.js";

const router = express.Router();

router.get("/", getAllFinance);
router.put("/:id", updateFinance);
router.get("/get/:id", getFinanceById);
router.post("/add", addFinance);
router.delete("/:id", deleteFinance);

export default router;
