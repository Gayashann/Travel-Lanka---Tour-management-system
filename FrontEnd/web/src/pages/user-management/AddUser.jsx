import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { EyeFilledIcon } from "../../icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../icon/EyeSlashFilledIcon";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


// Yup form schema
const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must contain only numbers")
    .required("Phone number is required")
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits"),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  role: yup.string().required("Role is required"),
});

const AddUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/auth/register-admin", data);

      toast.success("Registered successfully");

      navigate("/dashboard/manage-user");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  const roles = [
    "admin",
    "user",
    "event-manager",
    "inquiry-manager",
    "hotel-manager",
    "package-manager",
    "campingitem-manager",
    "feedback-manager",
    "vehicle-manager",
  ];

  return (
    <>
      <div className=" justify-center p-10 h-full items-center">
        <div className="flex-1 border-2 px-10 py-5 rounded-lg border-gray-400">
          <h1 className="text-lg ml-2 font-semibold text-gray-800">
            Add Staff
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
              placeholder="Enter username"
              {...register("username")}
              isInvalid={errors.username}
              errorMessage={errors.username?.message}
            />
            <Input
              size="md"
              variant="filled"
              type="text"
              label="Email"
              className="text-sm"
              placeholder="Enter email"
              {...register("email")}
              isInvalid={errors.email}
              errorMessage={errors.email?.message}
            />
            <Select
              items={roles}
              label="Role"
              placeholder="Select Role"
              variant="filled"
              className="flex-1"
              errorMessage={errors.role?.message}
              {...register("role")}
              isInvalid={errors.role}
            >
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              errorMessage={errors.phoneNumber?.message}
              {...register("phoneNumber", {
                required: "Phone number is required",
                validate: (value) =>
                  /^\d{10}$/.test(value) ||
                  "Phone number must be exactly 10 digits",
              })}
              maxLength={10}
              type="number"
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
              min={0}
              isInvalid={errors.phoneNumber}
            />
            <Input
              size="md"
              variant="filled"
              label="Password"
              className="text-sm"
              placeholder="Enter password"
              {...register("password")}
              isInvalid={errors.password}
              errorMessage={errors.password?.message}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
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
        <div className="flex-1">
          
        </div>
      </div>
    </>
  );
};

export default AddUser;
