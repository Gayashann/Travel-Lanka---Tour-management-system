import express from "express";
import Feedback from "../models/Feedback.model.js";
import { Parser } from "json2csv";

const router = express.Router();

// Generate CSV Report (GET /report)
router.get('/report', async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch all feedbacks

    // Define the fields/columns for the CSV
    const fields = ['username', 'ratings', 'service', 'message', 'visibility'];
    const opts = { fields };

    // Convert JSON data to CSV
    const parser = new Parser(opts);
    const csv = parser.parse(feedbacks);

    // Set response headers to download the CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('feedback_report.csv');
    return res.send(csv); // Send CSV content for download
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
