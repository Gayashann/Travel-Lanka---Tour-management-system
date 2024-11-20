import React, { useEffect, useMemo, useState } from "react";
import InquiryModal from "./InquiryModal";
import { Input, useDisclosure } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";
import "jspdf-autotable";
import img from "../../assets/logo.png";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"; // Recharts import

const InquiryHistory = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [clickingInquiry, setClickingInquiry] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [refetch, setRefetch] = useState(true);
  const [search, setSearch] = useState("");

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560"];

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    console.log("stored user", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse authUser from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  const filteredStaff = useMemo(() => {
    return inquiries.filter((item) =>
      item.issueType.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, inquiries]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch("http://localhost:5000/inquiry");
        const data = await res.json();
        console.log("inq", data);
        const readInquiries = data.inquiries.filter((inq) => inq.read === true);
        setInquiries(readInquiries);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInquiries();
  }, [refetch]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };

  // Transform the inquiry data to count inquiries by issueType and calculate percentage
  const issueTypeData = useMemo(() => {
    const issueCount = {};
    inquiries.forEach((item) => {
      if (issueCount[item.issueType]) {
        issueCount[item.issueType] += 1;
      } else {
        issueCount[item.issueType] = 1;
      }
    });

    const totalInquiries = inquiries.length;

    // Convert the issueCount object into an array for Recharts, with percentage calculation
    return Object.keys(issueCount).map((issueType) => ({
      issueType,
      count: issueCount[issueType],
      percentage: ((issueCount[issueType] / totalInquiries) * 100).toFixed(2), // Calculate percentage
    }));
  }, [inquiries]);

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Get current date and time
    const date = new Date();
    const formattedDate = date.toLocaleString(); // Format the date

    // Fetch the image as a Blob and convert it to base64
    const imageResponse = await fetch(img);
    const imageBlob = await imageResponse.blob();

    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);

    reader.onloadend = function () {
      const base64data = reader.result;

      // Simulate a shadow by drawing the image slightly offset with lower opacity (shadow effect)
      doc.setGState(new doc.GState({ opacity: 0.2 })); // Set low opacity for the shadow
      doc.addImage(
        base64data,
        "JPEG",
        5, // Slightly offset to the right
        5, // Slightly offset downward
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight() - 87
      );

      // Add text and table content
      doc.setGState(new doc.GState({ opacity: 1 })); // Restore full opacity
      doc.setFontSize(18);
      doc.text("Travel Lanka", 14, 10);

      // Add new title
      doc.setFontSize(14);
      doc.text("Inquiry Management Report", 14, 20);

      doc.setFontSize(12);
      doc.text(`Generated on: ${formattedDate}`, 14, 30); // Add date and time

      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.getWidth();
      const contactText = [
        "Contact Us",
        "123 Polonnaruwa road, Habarana",
        "Email: info@travellanka.com",
        "Phone: +9411 525 0302",
      ];

      contactText.forEach((line, index) => {
        doc.text(line, pageWidth - 70, 40 + index * 5);
      });

      const tableColumn = [
        "Name",
        "Email",
        "Priority",
        "Message",
        "Issue Type",
        "Contact Number",
        "Contact Method",
      ];

      const tableRows = [];

      // Use the filtered staff inquiries instead of all inquiries
      filteredStaff.forEach((item) => {
        const rowData = [
          item.name,
          item.email,
          item.priority,
          item.message,
          item.issueType,
          item.contactNumber,
          item.contactMethod,
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60, // Start after the title, date, and contact info
      });

      doc.save("Inquiry-History-report.pdf");
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <div className="mb-10">
        <Input
          isClearable
          radius="full"
          placeholder="Search issue type..."
          startContent={<IoSearch />}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="text-xl font-semibold">
        Hello {user?.username || "Guest"}!
      </div>
      <h1 className="text-5xl flex items-center justify-center font-bold mt-5">
        Inquiries
      </h1>
      <button
        className="bg-blue-500 h-10 text-white px-4 text-sm rounded-lg"
        onClick={generatePDF}
      >
        Download PDF
      </button>

      {/* Pie Chart for Issue Types */}
      <div className="w-full h-80 mt-10">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={issueTypeData}
              dataKey="count"
              nameKey="issueType"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ issueType, percentage }) =>
                `${issueType}: ${percentage}%`
              } // Show percentage in labels
            >
              {issueTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${props.payload.percentage}%`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-10">
        {filteredStaff?.map((inquiry) => (
          <div
            className="p-3 hover:cursor-pointer hover:scale-105 duration-200"
            key={inquiry.id}
            onClick={() => {
              setClickingInquiry(inquiry);
              onOpenChange();
            }}
          >
            <div
              className="w-56 bg-white rounded-lg"
              style={{
                boxShadow: `5px 0 0px 0px ${getPriorityColor(
                  inquiry.priority
                )}`,
              }}
            >
              <p className="text-2xl p-3">{inquiry.name}</p>
              <p className="text-xl p-2">{inquiry.issueType}</p>
            </div>
          </div>
        ))}
      </div>

      <InquiryModal
        clickingInquiry={clickingInquiry}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        historyModel={true}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default InquiryHistory;
