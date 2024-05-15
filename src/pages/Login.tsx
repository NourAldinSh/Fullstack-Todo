import { useState } from "react";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FROM } from "../data";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import axiosInstance from "../config/axios.config";
import { Link } from "react-router-dom";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  // ** Renders
  const renderLoginFrom = LOGIN_FROM.map(({ name, placeholder, type, validation }, idx) => (
    <div key={idx}>
      <Input type={type} placeholder={placeholder} {...register(name, validation)} />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
    </div>
  ));

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    setIsLoading(true);

    try {
      // ** 2 - Fulfilled => Success => (Optional)
      const { status, data: resData } = await axiosInstance.post("/auth/local", data);
      console.log(resData);

      if (status == 200) {
        toast.success("You will navigate to the home page after 2 seconds", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
      }

      localStorage.setItem("loggedInUser", JSON.stringify(resData));

      setTimeout(() => {
        location.replace("/");
      }, 2000);
    } catch (error) {
      // ** 3 - Rejected => Field => (Optional)
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginFrom}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>No account?</span>
          <Link to={"/register"} className="underline text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
