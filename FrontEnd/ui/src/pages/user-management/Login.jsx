import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
    <div className="p-10 flex  h-full w-full flex-col items-center justify-center  px-10 ">
      <div className="flex w-[800px] border-2 p-5  bg-gradient-to-r from-red-100 to-red-300 h-[400px] items-center justify-center rounded-lg">
        <div className="flex-1">
          <img src={travel} alt="logo" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex   flex-col gap-2 max-sm:px-10 p-2 w-[400px] "
        >
          <div className="flex flex-col items-center justify-center ">
            <h1 className="mb-3  font-serif text-xl font-bold text-black ">
              Login to your account
            </h1>
          </div>
          <input placeholder="Enter your email" {...register("email")} />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
          <input placeholder="Enter your password" {...register("password")} />
          {errors.password && (
            <span className="text-red-500 text-sm ">
              {errors.password.message}
            </span>
          )}
          <button type="submit" className="bg-black font-bold text-white p-2 ">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center justify-center">
            <p className="text-sm">Don t have an account?</p>
            <a
              className="text-black font-bold"
              onClick={() => navigate("/register")}
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
