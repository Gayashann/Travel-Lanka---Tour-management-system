import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditFinance = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "Income",
    title: "",
    description: "",
    amount: "",
    date: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/finance/get/${id}`);
        const finance = res.data.finance;
        console.log(finance);
        if (finance) {
          setFormData({
            type: finance.type,
            title: finance.title,
            description: finance.description,
            amount: finance.amount,
            date: finance.date,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Submitted data: ", formData);
      setErrors({});

      setFormData({
        type: "Income",
        title: "",
        description: "",
        amount: "",
        date: "",
      });

      const response = await axios.put(
        "http://localhost:5000/finance/" + id,
        formData
      );

      toast.success("Data Updated successfully");
      navigate("/dashboard/finance-list");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount should be a positive number";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  return (
    <div>
      <div></div>
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md mt-12">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Edit Finance </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split("T")[0]}
              max={
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                  .toISOString()
                  .split("T")[0]
              }
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditFinance;
