import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { MdDeleteSweep } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

const FinanceList = () => {
  const [financeList, setFinanceList] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [report, setReport] = useState(null);

  const { isOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const rowsPerPage = 6;
  const pages = Math.ceil(financeList.length / rowsPerPage);

  const filteredFinance = useMemo(() => {
    const month = selectedMonth;

    // if (month === 0) {
    //   return financeList;
    // }

    return financeList.filter(
      (item) => new Date(item.date).getMonth() + 1 === parseInt(month)
    );
  }, [selectedMonth, financeList]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredFinance?.slice(start, end);
  }, [page, filteredFinance]);

  useEffect(() => {
    const fetchFinanceList = async () => {
      const response = await axios.get("http://localhost:5000/finance");
      setFinanceList(response.data.finance);
      console.log(response);
    };
    fetchFinanceList();
  }, []);

  const generateReport = () => {
    const expenses = filteredFinance.filter((item) => item.type === "Expense");
    const income = filteredFinance.filter((item) => item.type === "Income");

    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
    const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
    const totalProfit = totalIncome - totalExpenses;

    setReport({
      expenses,
      income,
      totalExpenses,
      totalIncome,
      totalProfit,
    });
  };

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

  const downloadReport = () => {
    setReport(null);
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);
    doc.text("Finance Report", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Month: ${months[selectedMonth - 1]}`, 14, 25);

    const generatedDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${generatedDate}`, 14, 30);

    const expenses = financeList
      .filter((item) => item.type.toLowerCase() === "expense")
      .map((item) => [item.title, `Rs.${item.amount}`]);

    const income = financeList
      .filter((item) => item.type.toLowerCase() === "income")
      .map((item) => [item.title, `Rs.${item.amount}`]);

    doc.autoTable({
      startY: 40,
      head: [["Expenses", "Amount (Rs.)"]],
      body: expenses,
      theme: "grid",
      headStyles: { fillColor: [255, 0, 0] },
      styles: { fontSize: 10, textColor: [0, 0, 0] },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Income", "Amount (Rs.)"]],
      body: income,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0] },
      styles: { fontSize: 10, textColor: [0, 0, 0] },
    });

    const totalExpense = expenses.reduce(
      (sum, item) => sum + parseFloat(item[1].replace("Rs.", "")),
      0
    );
    const totalIncome = income.reduce(
      (sum, item) => sum + parseFloat(item[1].replace("Rs.", "")),
      0
    );
    const totalProfit = totalIncome - totalExpense;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 255);
    doc.text(
      `Total Expense: Rs.${totalExpense}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Total Income: Rs.${totalIncome}`,
      14,
      doc.lastAutoTable.finalY + 30
    );
    doc.text(
      `Total Profit: Rs.${totalProfit}`,
      14,
      doc.lastAutoTable.finalY + 40
    );

    doc.save("finance_report.pdf");
  };

  const deleteFinance = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/finance/${id}`);
      setFinanceList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full max-h-full overflow-y-auto"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        className="w-[900px] mt-2
      "
      >
        <div className="flex  w-full mb-5 ">
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
          <Button
            className="text-white ml-5"
            color="success"
            onClick={generateReport}
          >
            Generate Finance Report
          </Button>
        </div>

        <Table
          aria-label="Example table with pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Id</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString("en-US")}
                </TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell className="flex gap-6">
                  <Tooltip content="Edit user">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <FaUserEdit
                        onClick={() =>
                          navigate(`/dashboard/edit-finance/${item._id}`)
                        }
                      />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <MdDeleteSweep onClick={() => deleteFinance(item._id)} />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {report && (
          <div className="mt-10 bg-white p-5 rounded-sm">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Finance Report</h2>
              <button
                onClick={downloadReport}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Download Report
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Expenses</h3>
              {report.expenses.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>Rs.{item.amount}</span>
                </div>
              ))}
              <div className="mt-2 font-semibold">
                Total Expense: Rs.{report.totalExpenses}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Income</h3>
              {report.income.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>Rs.{item.amount}</span>
                </div>
              ))}

              <div className="mt-2 font-semibold">
                Total Income: Rs.{report.totalIncome}
              </div>
            </div>

            <div className="mt-4 font-bold">
              Total Profit: Rs.{report.totalProfit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceList;
