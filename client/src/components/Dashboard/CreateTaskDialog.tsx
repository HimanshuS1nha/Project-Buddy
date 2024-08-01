import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  createTaskValidator,
  createTaskValidatorType,
} from "../../../validators/create-task-validator";
import Loading from "../Loading";

const CreateTaskDialog = ({
  isVisible,
  setIsVisible,
  type,
  id,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  type: "Pending" | "Review" | "Completed" | "";
  id: string;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createTaskValidatorType>({
    defaultValues: {
      title: "",
      description: "",
      endDate: "",
      assignedTo: "",
      startDate: "",
    },
    resolver: zodResolver(createTaskValidator),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-all-team-members"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-all-team-members`,
        { id },
        { withCredentials: true }
      );
      return data as { teamMembers: { id: string; name: string }[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const { mutate: handleAddTask, isPending } = useMutation({
    mutationKey: ["add-task"],
    mutationFn: async (values: createTaskValidatorType) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-task`,
        { ...values, status: type, projectId: id },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-project"] });
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
          <DialogTitle>Create {type} Task</DialogTitle>
          <DialogDescription>Click create when you're done.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit((data) => handleAddTask(data))}
        >
          <div className="flex flex-col gap-y-4">
            {isPending ||
              (isLoading && (
                <div className="flex justify-center w-full">
                  <Loading />
                </div>
              ))}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter task's title"
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
                type="text"
                placeholder="Enter task's description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: "true" })}
              />
              {errors.startDate && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", { required: "true" })}
              />
              {errors.endDate && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.endDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {data?.teamMembers.map((teamMember) => {
                    return (
                      <SelectItem value={teamMember.id} key={teamMember.id}>
                        {teamMember.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-rose-500 text-sm font-semibold">
                  {errors.assignedTo.message}
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

export default CreateTaskDialog;
