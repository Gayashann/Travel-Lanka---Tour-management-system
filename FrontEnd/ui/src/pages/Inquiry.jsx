import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { app } from "../db/firebase";
import axios from "axios";
import toast from "react-hot-toast";

const storage = getStorage(app);

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3),
  contactNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 12 digits"),
  issueType: yup.string().required("Select IssueType is required"),
  priority: yup.string().required("Select IssueType is required"),
  description: yup.string().required(),
  contactMethod: yup.string().required(),
  // consent: yup.string().required(),
});

const Inquiry = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const fileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
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

  const onSubmit = async (data) => {
    const storageRef = ref(storage, `doc/${file.name}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    const inquiryData = {
      user: user,
      name: data.username,
      email: data.email,
      contactNumber: data.contactNumber,
      attachment: url,
      issueType: data.issueType,
      priority: data.priority,
      description: data.description,
      contactMethod: data.contactMethod,
    };
    console.log("Inquiry Data to Send:", inquiryData);
    try {
      const res = await axios.post(
        "http://localhost:5000/inquiry",
        inquiryData
      );
      console.log("Response:", res);

      if (res.status === 201) {
        toast.success("Inquiry added successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  const issues = ["Vehicale Issue ", "Hotel Issue", "Food Issue"];
  const priority = ["Low", "Medium", "High"];
  const contactMethod = ["Text", "Phone", "On Location"];

  return (
    <div className=" p-10 md:max-w-screen-md">
      <form
        className="mt-4 flex gap-2 flex-col h-full  p-5 bg-white rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          size="md"
          variant="filled"
          type="text"
          className="text-sm "
          label="Username"
          placeholder="Enter  username"
          {...register("username")}
          isInvalid={errors.username}
          errorMessage={errors.username?.message}
        />
        <Input
          size="md"
          variant="filled"
          type="text"
          label="Email"
          className="text-sm "
          placeholder="Enter  email"
          {...register("email")}
          isInvalid={errors.email}
          errorMessage={errors.email?.message}
        />
        <Select
          items={issues}
          label="Issue"
          placeholder="Select Issue"
          variant="filled"
          className=""
          errorMessage={errors.issueType?.message}
          {...register("issueType")}
          isInvalid={errors.issueType}
        >
          {issues.map((Issue) => (
            <SelectItem key={Issue} value={Issue}>
              {Issue}
            </SelectItem>
          ))}
        </Select>
        <Select
          items={priority}
          label="Priority"
          placeholder="Select Priority"
          variant="filled"
          className=" "
          errorMessage={errors.priority?.message}
          {...register("priority")}
          isInvalid={errors.priority}
        >
          {priority.map((priority) => (
            <SelectItem
              style={{
                boxShadow:
                  priority === "High"
                    ? "5px 0 0px 0px red"
                    : priority === "Medium"
                    ? "5px 0 0px 0px orange"
                    : priority === "Low"
                    ? "5px 0 0px 0px green"
                    : "none",
                color:
                  priority === "High"
                    ? "red"
                    : priority === "Medium"
                    ? "orange"
                    : priority === "Low"
                    ? "green"
                    : "inherit",
                fontWeight: "600", // semibold
              }}
              key={priority}
              value={priority}
            >
              {priority}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Phone Number"
          placeholder="Enter Phone Number"
          variant="filled"
          errorMessage={errors.contactNumber?.message}
          {...register("contactNumber")}
          isInvalid={errors.contactNumber}
        />
        <Textarea
          size="md"
          variant="filled"
          type="text"
          className="text-sm "
          label="More Information"
          placeholder="More Information"
          {...register("description")}
          isInvalid={errors.description}
          errorMessage={errors.description?.message}
        />
        <div className="bg-gray-100 p-2 rounded-lg">
          <label for="password" className="block text-sm text-gray-600">
            Attachment
          </label>
          <input
            accept=".pdf"
            type="file"
            onChange={(e) => fileChange(e)}
            className="px-4 py-2 rounded-lg w-full"
          />
          {<p className="text-red-500 text-xs">{errors.file?.message}</p>}
        </div>
        <Select
          items={contactMethod}
          label="Contact Method"
          placeholder="Select Contact Method"
          variant="filled"
          className=""
          errorMessage={errors.contactMethod?.message}
          {...register("contactMethod")}
          isInvalid={errors.contactMethod}
        >
          {contactMethod.map((cm) => (
            <SelectItem key={cm} value={cm}>
              {cm}
            </SelectItem>
          ))}
        </Select>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="large"
            className="bg-black text-white mt-2"
            loading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Inquiry;
