import Finance from "../model/Finance.js";

export const addFinance = async (req, res) => {
  try {
    const { type, title, description, amount, date } = req.body;
    const finance = new Finance({
      type,
      title,
      description,
      amount,
      date,
    });
    await finance.save();
    res.status(201).json({ finance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFinance = async (req, res) => {
  try {
    const finance = await Finance.find();
    res.status(200).json({ finance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFinance = async (req, res) => {
  try {
    const { id } = req.params;
    await Finance.findByIdAndDelete(id);
    res.status(200).json({ message: "Finance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const finance = await Finance.findById(id);
    res.status(200).json({ finance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFinance = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, amount, date } = req.body;
    const finance = await Finance.findById(id);
    if (finance) {
      finance.type = type;
      finance.title = title;
      finance.description = description;
      finance.amount = amount;
      finance.date = date;
      await finance.save();
      res.status(200).json({ finance });
    } else {
      res.status(404).json({ message: "Finance not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
