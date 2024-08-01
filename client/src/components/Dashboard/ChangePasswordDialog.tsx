import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  changePasswordValidator,
  changePasswordValidatorType,
} from "../../../validators/change-password-validator";

const ChangePasswordDialog = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordValidatorType>({
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
      oldPassword: "",
    },
    resolver: zodResolver(changePasswordValidator),
  });

  const { mutate: handleChangePassword, isPending } = useMutation({
    mutationKey: ["chage-password"],
    mutationFn: async (values: changePasswordValidatorType) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/change=password`,
        { ...values },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      setIsVisible(false);
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
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Change your current password.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit((data) => handleChangePassword(data))}
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                id="oldPassword"
                placeholder="Enter old password"
                required
                {...register("oldPassword", { required: true })}
              />
              {errors.oldPassword && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                placeholder="Enter new password"
                required
                {...register("newPassword", { required: true })}
              />
              {errors.newPassword && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                placeholder="Confirm new password"
                required
                {...register("confirmPassword", { required: true })}
              />
              {errors.confirmPassword && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Please wait..." : "Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
