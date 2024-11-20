import { useEffect, useState } from "react";
import axios from "axios";

const FinanceReport = () => {
  const [financeList, setFinanceList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  useEffect(() => {
    const fetchFinanceList = async () => {
      const response = await axios.get("http://localhost:5000/finance");
      setFinanceList(response.data.finance);
      console.log(response);
    };
    fetchFinanceList();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const generateReport = () => {
    const month = selectedMonth;
    console.log(month);
    const filteredFinance = financeList.filter(
      //date "2024-10-16T00:00:00.000Z"
      (item) => new Date(item.date).getMonth() + 1 === parseInt(month)
    );
    console.log(filteredFinance);
  };

  return (
    <div>
      <div>
        <h1>Finance Report</h1>
        <select
          name="month"
          id="month"
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="0">Select Month</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};
export default FinanceReport;
