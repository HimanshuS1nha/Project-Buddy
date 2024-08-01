import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProjectValidator,
  createProjectValidatorType,
} from "../../../validators/create-project-validator";

const CreateNewProjectDialog = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<createProjectValidatorType>({
    defaultValues: {
      description: "",
      status: "",
      title: "",
    },
    resolver: zodResolver(createProjectValidator),
  });

  const { mutate: handleCreateProject, isPending } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (values: createProjectValidatorType) => {
      console.log(values.status);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-project`,
        { ...values },
        { withCredentials: true }
      );
      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit((data) => handleCreateProject(data))}
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter project's title"
                required
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-rose-500 text-xs">(Optional)</span>
              </Label>
              <Input
                id="description"
                placeholder="Enter project's description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                required
                onValueChange={(value) =>
                  setValue("status", value as "" | "Live" | "Building")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent id="status">
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Please wait..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewProjectDialog;
