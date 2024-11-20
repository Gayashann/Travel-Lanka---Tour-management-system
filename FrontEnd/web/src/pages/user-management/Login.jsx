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
import travel from "../../assets/pngwing.com.png";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    isTouchField,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", data);
      console.log(res.status);
      if (res.status === 200) {
        toast.success("Login successfully");
        localStorage.setItem("authUser", JSON.stringify(res.data.user));

        navigate("/");
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message);
        // console.log(error)
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="fixed flex  h-full w-full flex-col items-center justify-center bg-blue-300 px-10 ">
      <div className="flex w-[800px] border-2 p-5  bg-gradient-to-r from-blue-200 to-blue-500 h-[400px] items-center justify-center rounded-lg">
        <div className="flex-1">
          <img src={travel} alt="logo" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96   flex-col gap-3 max-sm:px-10 p-2"
        >
          <div className="flex flex-col items-center justify-center ">
            <h1 className="mb-3  font-serif text-xl font-bold text-black ">
              Login to your account
            </h1>
          </div>
          <Input
            size="md"
            variant="filled"
            type="text"
            label="Email"
            className="text-sm "
            placeholder="Enter your email"
            {...register("email")}
            touched={isTouchField}
            isInvalid={errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            size="md"
            variant="filled"
            label="Password"
            className="text-sm "
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
            className="bg-black font-bold text-white  "
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <div className="flex items-center justify-center">
            <p className="text-sm">Don't have an account?</p>
            <Button
              variant="text"
              size="sm"
              className="text-black font-bold"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
