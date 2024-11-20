import React from "react";
import { MdDeleteSweep } from "react-icons/md";

import {
  Input,
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
import { FaUserEdit } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DeleteEventModel from "./DeleteEventModel";
import img from "../../assets/logo.png";

const EventList = () => {
  const [page, setPage] = useState(1);
  const [event, setEvent] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState("");
  const [refetch, setRefetch] = useState(false);
  const { isOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const rowsPerPage = 4;
  const pages = Math.ceil(event.length / rowsPerPage);

  const filteredStaff = useMemo(() => {
    return event.filter((item) =>
      item.eventName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, event]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff?.slice(start, end);
  }, [page, filteredStaff]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();
        setEvent(data.events);
        setLoading(false);
        setRefetch(false);
        console.log("Data for table:", data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, [refetch]);

  const generatePDF = async () => {
    const doc = new jsPDF();

    const imageUrl = img;
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);

    reader.onloadend = function () {
      const base64data = reader.result;
     doc.setGState(new doc.GState({ opacity: 0.2 })); 

     doc.addImage(
       base64data,
       "JPEG",
       0,
       0,
       doc.internal.pageSize.getWidth() - 10,
       doc.internal.pageSize.getHeight() - 50
     );

     doc.setGState(new doc.GState({ opacity: 1 }));
      doc.setFontSize(18);
      doc.text("Event List", 14, 10);
      const tableColumn = [
        "Id",
        "Event Name",
        "Date",
        "District",
        "Description",
      ];
      const tableRows = [];

      // Add event data to table rows
      event.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.eventName,
          item.eventDate,
          item.district,
          item.description,
        ];
        tableRows.push(rowData);
      });

      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20, 
      });

      // Save the PDF
      doc.save("event-list-report.pdf");
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full items-center justify-center flex flex-col">
        <div className="flex justify-between p-2">
          <h1 className="text-center mt-2 font-semibold text-lg">Event List</h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search events..."
              startContent={<IoSearch />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex w-[1000px] justify-end gap-3">
            <button className="bg-green-500 text-white px-4 text-sm rounded-lg">
              <Link to="/dashboard/add-event">Add Event</Link>
            </button>
            <button
              className="bg-blue-500 text-white px-4 text-sm rounded-lg"
              onClick={generatePDF}
            >
              Download PDF
            </button>
          </div>
        </div>
        <div className="min-w-[1000px] mt-2">
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
              <TableColumn>Event Name</TableColumn>
              <TableColumn>Event Image</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>District</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                return (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.eventName}</TableCell>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.eventName}
                        className="w-16 h-16 object-cover"
                      />
                    </TableCell>
                    <TableCell>{item.eventDate}</TableCell>
                    <TableCell>{item.district}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="flex gap-6  items-center h-16">
                      <Tooltip content="Edit Event" className="">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <FaUserEdit
                            onClick={() =>
                              navigate(`/dashboard/edit-events/${item._id}`)
                            }
                          />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete Event">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => {
                              setEventId(item._id);
                              onOpenChange();
                            }}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteEventModel
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        eventId={eventId}
        setEventId={setEventId}
        setRefetch={setRefetch}
        setEvent={setEvent}
      />
    </>
  );
};
export default EventList;
