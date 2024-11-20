import React, { useEffect, useMemo, useState } from "react";
import InquiryModal from "./InquiryModal";
import { Input, useDisclosure } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";
import png from "../../assets/logo.png";

const InquiryHistory = () => {
  const [user, setUser] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [clickingInquiry, setClickingInquiry] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [refetch, setRefetch] = useState(true);
  const [search, setSearch] = useState("");

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

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

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
  console.log("inquiries", inquiries);
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Inquiry History", 14, 10);

    const imgBase64 = convertImageToBase64(png);
    doc.addImage(imgBase64, "PNG", 40, 80, 120, 120, undefined, "SLOW");

    doc.setTextColor(150, 150, 150);

    const tableColumn = [
      "Name",
      "Email",
      "Priority",
      "Message",
      "Issue Type",
      "Description",
      "Contact Number",
      "Contact Method",
    ];

    const tableRows = [];

    inquiries.forEach((item, index) => {
      const rowData = [
        item.name,
        item.email,
        item.priority,
        item.message,
        item.issueType,
        item.description,
        item.contactNumber,
        item.contactMethod,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("event-list-report.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-5">
      <div className=" mb-10">
        <Input
          isClearable
          radius="full"
          placeholder="Search events..."
          startContent={<IoSearch />}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="text-xl font-semibold">Hello {user.username}!</div>
      <h1 className="text-5xl flex items-center justify-center font-bold mt-5">
        Inquiries
      </h1>
      <button
        className="bg-blue-500 h-10 text-white px-4 text-sm rounded-lg"
        onClick={generatePDF}
      >
        Download PDF
      </button>
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
              className="w-56  bg-white rounded-lg"
              style={{
                boxShadow: `5px 0 0px 0px ${getPriorityColor(
                  inquiry.priority
                )}`,
              }}
            >
              <p className=" text-2xl p-3">{inquiry.name}</p>
              <p className=" text-xl p-2">{inquiry.issueType}</p>
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
