import React, { useEffect, useState } from "react";
import InquiryModal from "./InquiryModal";
import { useDisclosure } from "@nextui-org/react";

const Inquiries = () => {
  const [user, setUser] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const { isOpen, onOpenChange } = useDisclosure();
  const [clickingInquiry, setClickingInquiry] = useState(null);
  const [refetch, setRefetch] = useState(true)

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

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch("http://localhost:5000/inquiry");
        const data = await res.json();
        console.log("inq", data);
        const readInquiries = data.inquiries.filter(inq => inq.read === false);
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

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-5">
      <div className="text-xl font-semibold">Hello {user.username}!</div>
      <h1 className="text-5xl flex items-center justify-center font-bold mt-5">
        Inquiries
      </h1>
      <div className="grid grid-cols-5 gap-4 mt-10">
        {inquiries?.map((inquiry) => (
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

              {/* <div className=" flex justify-center items-center">
                <button
                  onClick={() => {
                    setClickingInquiry(inquiry);
                    onOpenChange();
                  }}
                >
                  View More Details
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
      <InquiryModal
        user={user}
        clickingInquiry={clickingInquiry}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setRefetch = {setRefetch}
      />
    </div>
  );
};

export default Inquiries;
