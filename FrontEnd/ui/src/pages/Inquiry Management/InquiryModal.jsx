import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const InquiryModal = ({
  clickingInquiry,
  isOpen,
  onOpenChange,
  setRefetch,
  historyModel,
  userModel,
}) => {
  const [reply, setReply] = useState(""); // State for reply input
  const [message, setMessage] = useState("");

  const updateInquiry = async () => {
    const data = { read: true, message };
    try {
      const inquiry = await fetch(
        `http://localhost:5000/inquiry/${clickingInquiry._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      setRefetch((pre) => !pre);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getBorderColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "gray"; // Default color if priority is not recognized
    }
  };

  const deletingQueiry = async () => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/inquiry/${clickingInquiry._id}`
      );
      setRefetch((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownloadPDF = async (clickingInquiry) => {
    console.log(clickingInquiry);

    window.open(clickingInquiry.attachment, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent
        style={{
          border: `5px solid ${getBorderColor(clickingInquiry?.priority)}`,
        }}
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {clickingInquiry.issueType}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2">
                <p>
                  <strong>Name:</strong> {clickingInquiry.name}
                </p>
                <p>
                  <strong>Email:</strong> {clickingInquiry.email}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {clickingInquiry.contactNumber}
                </p>
                <p>
                  <strong>Contact Method:</strong>{" "}
                  {clickingInquiry.contactMethod}
                </p>
              </div>

              {!historyModel && clickingInquiry.contactMethod === "Text" && (
                <div className="mt-4">
                  <label htmlFor="reply" className="block text-sm font-medium">
                    Reply
                  </label>
                  <input
                    id="message"
                    type="text"
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                    placeholder="Type your reply here..."
                  />
                </div>
              )}
              {userModel && (
                <div className=" flex font-bold">Reply : 
                  <p className="font-normal first-letter:capitalize"> {clickingInquiry.message ? (
                    clickingInquiry.message
                  ) : (
                    <div>no message</div>
                  )}</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                variant="flat"
                onPress={() => {
                  handleDownloadPDF(clickingInquiry);
                }}
              >
                Download PDF
              </Button>
              {!historyModel ? (
                <Button
                  color="primary"
                  onPress={() => {
                    // Handle reply submission here
                    console.log("Reply submitted:", reply);
                    updateInquiry();
                    onClose();
                  }}
                >
                  Mark As Read
                </Button>
              ) : (
                <Button
                  color="danger"
                  //   onClick={deletingQueiry}
                  onPress={() => {
                    deletingQueiry();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InquiryModal;
