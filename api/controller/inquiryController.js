import Inquiry from "../model/Inquiry.js";

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate("user");

    res.status(200).json({ inquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const inquiry = req.body;

    const newInquiry = new Inquiry(inquiry);

    await newInquiry.save();

    res.status(201).json({ inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    const inquiryToUpdate = await Inquiry.findById(id);

    if (!inquiryToUpdate) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({ inquiry: updatedInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    await Inquiry.findByIdAndDelete(id);

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
