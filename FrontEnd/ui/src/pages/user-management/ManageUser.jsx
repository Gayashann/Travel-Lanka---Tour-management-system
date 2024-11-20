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

import DeleteUserModel from "./DeleteUserModel";

const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [refetch, setRefetch] = useState(false);

  const { isOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const rowsPerPage = 6;
  const pages = Math.ceil(user.length / rowsPerPage);

  const filteredStaff = useMemo(() => {
    return user.filter(
      (item) =>
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, user]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStaff?.slice(start, end);
  }, [page, filteredStaff]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth");
        const data = await res.json();
        setUser(data.users);
        setLoading(false);
        setRefetch(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, [refetch]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Users List Report", 14, 10);

    const tableColumn = ["ID", "Username", "Email", "Role", "Phone Number"];
    const tableRows = [];

    items.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.username,
        item.email,
        item.role,
        item.phoneNumber,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("user-list-report.pdf");
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
          <h1 className="text-center mt-2 font-semibold text-lg">User List</h1>
        </div>
        <div className="flex w-[1000px] justify-between">
          <div>
            <Input
              isClearable
              radius="full"
              placeholder="Search user..."
              startContent={<IoSearch />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-green-500 text-white px-4 text-sm rounded-lg">
              <Link to="/dashboard/add-user">Add User</Link>
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
              <TableColumn>Username</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Phone Number</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {item.role === "admin" ? "Admin" : "User"}
                  </TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                  <TableCell className="flex gap-6">
                    <Tooltip content="Edit user">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <FaUserEdit
                          onClick={() =>
                            navigate(`/dashboard/edit-user/${item._id}`)
                          }
                        />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        <MdDeleteSweep
                          onClick={() => {
                            setUserId(item._id);
                            onOpenChange();
                          }}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteUserModel
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        userId={userId}
        setUserId={setUserId}
        setRefetch={setRefetch}
        setUser={setUser}
      />
    </>
  );
};
export default ManageUser;
