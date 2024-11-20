import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../../icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../icon/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import travel from "../../assets/signup.png";

// Validation schema
const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required().min(3),
  phoneNumber: yup
    .string()
    
    .matches(/^[0-9]+$/, "Phone number must contain only numbers")
    .required("Phone number is required"),
  password: yup.string().min(6).required(),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  // Restrict phone number input to only numbers and block input after 10 digits
  const handlePhoneNumberInput = (e) => {
    const value = e.target.value;

    // Allow input only if it's numeric and has at most 10 digits
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setValue("phoneNumber", value); // Update the phone number value in the form
    }
  };

  const onSubmit = async (data) => {
    data.profilePicture =
      "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png";

    try {
      await axios.post("http://localhost:5000/auth/register", data);

      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="fixed w-full flex h-screen flex-col items-center justify-center bg-blue-300">
      <div className="flex w-[850px] p-5 bg-gradient-to-r from-blue-200 to-blue-500 h-[550px] items-center justify-center rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96 flex-col gap-3 max-sm:px-10 p-2"
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-3 font-serif text-xl font-bold text-black">
              Register Your Account
            </h1>
          </div>

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
            label="Email"
            className="text-sm"
            placeholder="Enter your email"
            {...register("email")}
            isInvalid={errors.email}
            errorMessage={errors.email?.message}
          />

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
            placeholder="Enter your password"
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

          <Button
            type="submit"
            size="sm"
            className="bg-black text-white"
            isLoading={isSubmitting}
          >
            Register
          </Button>

          <div className="flex items-center justify-center">
            <p className="text-sm">Already have an account? </p>
            <Button
              variant="text"
              size="sm"
              className="text-black font-bold"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </form>

        <div className="flex-1">
          <img src={travel} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Register;
