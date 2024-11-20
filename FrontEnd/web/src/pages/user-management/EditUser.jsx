import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be at most 12 digits"),
  role: yup.string().required("Role is required"),
});

const EditUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/auth/${id}`, data);
      toast.success("Updated successfully");
      navigate("/dashboard/manage-user");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auth/${id}`);
        const userData = res.data.user;

        if (userData) {
          reset({
            username: userData.username,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            role: userData.role,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [id, reset]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  }

  const roles = ["admin", "user"];

  return (
    <>
      <div className="flex justify-center p-3 h-full items-center">
        <div className="w-[600px] border-2 px-10 py-5 rounded-lg">
          <h1 className="text-lg ml-2 font-semibold text-gray-800">
            Edit Staff
          </h1>
          <form
            className="mt-4 flex gap-2 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              size="md"
              variant="filled"
              type="text"
              className="text-sm"
              label="Username"
              placeholder="Enter your username"
              {...register("username")}
              isInvalid={errors.username}
              errorMessage={errors.username?.message}
            />
            <Input
              size="md"
              variant="filled"
              type="text"
              disabled
              label="Email"
              className="text-sm"
              placeholder="Enter your email"
              {...register("email")}
              isInvalid={errors.email}
              errorMessage={errors.email?.message}
            />
            <Select
              label="Role"
              placeholder="Select Role"
              variant="filled"
              className="flex-1"
              errorMessage={errors.role?.message}
              {...register("role")}
              isInvalid={errors.role}
              defaultValue=""
            >
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Phone Number"
              placeholder="Enter Phone Number"
              variant="filled"
              errorMessage={errors.phoneNumber?.message}
              {...register("phoneNumber")}
              isInvalid={errors.phoneNumber}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="large"
                className="bg-black text-white mt-2"
                loading={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUser;
