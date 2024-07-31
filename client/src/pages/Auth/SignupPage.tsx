import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signupValidator,
  signupValidatorType,
} from "../../../validators/signup-validator";

const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupValidatorType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupValidator),
  });

  const { mutate: handleSignup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (values: signupValidatorType) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          ...values,
        }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      navigate("/login");
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <div className="bg-gray-100 h-screen overflow-y-hidden flex justify-center items-center">
      <div className="w-[35%] rounded-xl bg-white flex flex-col p-6 gap-y-9">
        <p className="text-4xl font-bold text-center">
          Project<span className="text-green-600">Buddy</span>
        </p>

        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold">Welcome!</p>
          <p className="text-gray-700 text-sm">Create an account</p>
        </div>

        <form
          className="flex flex-col gap-y-6 w-full"
          onSubmit={handleSubmit((data) => handleSignup(data))}
        >
          <div className="flex flex-col gap-y-2.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              type="text"
              required
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-rose-500 text-sm font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              required
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-rose-500 text-sm font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              required
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-rose-500 text-sm font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              required
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <p className="text-rose-500 text-sm font-semibold">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Please wait..." : "Signup"}
          </Button>

          <div className="flex justify-center gap-x-2 items-center">
            <p>Already have an account?</p>
            <Link
              to={"/login"}
              className="text-green-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
