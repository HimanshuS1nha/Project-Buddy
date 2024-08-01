import { MdEdit } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { GoPlus } from "react-icons/go";
import { useEffect, useState } from "react";

import Header from "@/components/Dashboard/Header";
import { Button } from "@/components/ui/button";
import SignedIn from "@/components/Dashboard/SignedIn";
import { ProjectType, TaskType } from "types";
import Loading from "@/components/Loading";
import EditProjectDialog from "@/components/Dashboard/EditProjectDialog";
import AddTeamMembersDialog from "@/components/Dashboard/AddTeamMembersDialog";
import CreateTaskDialog from "@/components/Dashboard/CreateTaskDialog";
import EditTaskDialog from "@/components/Dashboard/EditTaskDialog";

const ProjectPage = () => {
  const params = useParams() as { id: string };
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditProjectDialogVisible, setIsEditProjectDialogVisible] =
    useState(false);
  const [isAddTeamMemberDialogVisible, setIsAddTeamMemberDialogVisible] =
    useState(false);
  const [isCreateTaskDialogVisible, setIsCreateTaskDialogVisible] =
    useState(false);
  const [isEditTaskDialogVisible, setIsEditTaskDialogVisible] = useState(false);
  const [type, setType] = useState<"Pending" | "Review" | "Completed" | "">("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [task, setTask] = useState<TaskType>({} as never);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-project"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-project`,
        { id: params.id },
        { withCredentials: true }
      );
      return data as { project: ProjectType & { tasks: TaskType[] } };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const { mutate: deleteProject, isPending } = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/delete-project`,
        { id: params.id },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
      toast.success(data.message);
      navigate(-1);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });

  const { mutate: handleChangeTaskStatus } = useMutation({
    mutationKey: ["change-task-status"],
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "Pending" | "Review" | "Completed";
    }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/change-task-status`,
        { id, status },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({ queryKey: ["get-project"] });
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });

  useEffect(() => {
    if (data?.project) {
      setTasks(data.project.tasks);
    }
  }, [data]);
  return (
    <SignedIn>
      <EditProjectDialog
        isVisible={isEditProjectDialogVisible}
        setIsVisible={setIsEditProjectDialogVisible}
        title={data?.project.title as string}
        status={data?.project.status as "Live" | "Building"}
        description={data?.project.description}
        id={params.id}
      />
      <AddTeamMembersDialog
        isVisible={isAddTeamMemberDialogVisible}
        setIsVisible={setIsAddTeamMemberDialogVisible}
        projectId={params.id}
      />
      <CreateTaskDialog
        isVisible={isCreateTaskDialogVisible}
        setIsVisible={setIsCreateTaskDialogVisible}
        type={type}
        id={params.id}
      />
      <EditTaskDialog
        isVisible={isEditTaskDialogVisible}
        setIsVisible={setIsEditTaskDialogVisible}
        id={params.id}
        task={task}
      />
      <div className="w-full h-screen">
        <Header active="projects" />

        <div className="px-40 mt-10 flex flex-col gap-y-12">
          {isPending ||
            (isLoading && (
              <div className="flex justify-center w-full">
                <Loading />
              </div>
            ))}
          {!isPending && data?.project && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  <p className="text-4xl font-semibold text-green-600">
                    {data?.project.title}
                  </p>
                  <div
                    className={`${
                      data?.project.status === "Live"
                        ? "bg-green-200"
                        : "bg-blue-200"
                    } w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
                  >
                    <GoDotFill
                      color={data?.project.status === "Live" ? "green" : "blue"}
                      size={14}
                    />
                    <p
                      className={`${
                        data?.project.status === "Live"
                          ? "text-green-600"
                          : "text-blue-600"
                      } capitalize text-sm font-semibold`}
                    >
                      {data?.project.status}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4 items-center">
                  <Button onClick={() => setIsEditProjectDialogVisible(true)}>
                    Edit project
                  </Button>
                  <Button onClick={() => setIsAddTeamMemberDialogVisible(true)}>
                    Add team members
                  </Button>
                  <Button
                    variant={"destructive"}
                    disabled={isPending}
                    onClick={() => {
                      const confirmation = confirm(
                        "Do you really want to delete this project?"
                      );
                      if (confirmation) {
                        deleteProject();
                      }
                    }}
                  >
                    Delete project
                  </Button>
                </div>
              </div>

              <div className="flex gap-x-12 justify-center">
                <div
                  className="flex flex-col gap-y-5 border border-gray-300 p-5 w-[300px] rounded-lg items-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    const newTasks = tasks.map((task) => {
                      if (task.id === e.dataTransfer.getData("id")) {
                        task.status = "Pending";
                      }
                      return task;
                    });

                    handleChangeTaskStatus({
                      id: e.dataTransfer.getData("id"),
                      status: "Pending",
                    });

                    setTasks(newTasks);
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <p className="text-2xl font-semibold text-rose-500">
                      Pending
                    </p>
                    <GoPlus
                      size={23}
                      color="red"
                      onClick={() => {
                        setType("Pending");
                        setIsCreateTaskDialogVisible(true);
                      }}
                      className="cursor-pointer"
                    />
                  </div>

                  {tasks
                    .filter((task) => task.status === "Pending")
                    .map((task) => {
                      return (
                        <div
                          className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]"
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("id", task.id);
                          }}
                        >
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-700">
                              {task.startDate} - {task.endDate}
                            </p>
                          </div>

                          <MdEdit
                            size={22}
                            color="black"
                            onClick={() => {
                              setTask(task);
                              setIsEditTaskDialogVisible(true);
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
                <div
                  className="flex flex-col gap-y-5 border border-gray-300 p-5 w-[300px] rounded-lg items-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    const newTasks = tasks.map((task) => {
                      if (task.id === e.dataTransfer.getData("id")) {
                        task.status = "Review";
                      }
                      return task;
                    });
                    handleChangeTaskStatus({
                      id: e.dataTransfer.getData("id"),
                      status: "Review",
                    });
                    setTasks(newTasks);
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <p className="text-2xl font-semibold text-blue-600">
                      Review
                    </p>
                    <GoPlus
                      size={23}
                      color="blue"
                      onClick={() => {
                        setType("Review");
                        setIsCreateTaskDialogVisible(true);
                      }}
                      className="cursor-pointer"
                    />
                  </div>

                  {tasks
                    .filter((task) => task.status === "Review")
                    .map((task) => {
                      return (
                        <div
                          className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]"
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("id", task.id);
                          }}
                        >
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-700">
                              {task.startDate} - {task.endDate}
                            </p>
                          </div>

                          <MdEdit
                            size={22}
                            color="black"
                            onClick={() => {
                              setTask(task);
                              setIsEditTaskDialogVisible(true);
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
                <div
                  className="flex flex-col gap-y-5 border border-gray-300 p-5 w-[300px] rounded-lg items-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    const newTasks = tasks.map((task) => {
                      if (task.id === e.dataTransfer.getData("id")) {
                        task.status = "Completed";
                      }
                      return task;
                    });
                    handleChangeTaskStatus({
                      id: e.dataTransfer.getData("id"),
                      status: "Completed",
                    });
                    setTasks(newTasks);
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <p className="text-2xl font-semibold text-green-600">
                      Completed
                    </p>
                    <GoPlus
                      size={23}
                      color="green"
                      onClick={() => {
                        setType("Completed");
                        setIsCreateTaskDialogVisible(true);
                      }}
                      className="cursor-pointer"
                    />
                  </div>

                  {tasks
                    .filter((task) => task.status === "Completed")
                    .map((task) => {
                      return (
                        <div
                          className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]"
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("id", task.id);
                          }}
                        >
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-700">
                              {task.startDate} - {task.endDate}
                            </p>
                          </div>

                          <MdEdit
                            size={22}
                            color="black"
                            onClick={() => {
                              setTask(task);
                              setIsEditTaskDialogVisible(true);
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SignedIn>
  );
};

export default ProjectPage;
