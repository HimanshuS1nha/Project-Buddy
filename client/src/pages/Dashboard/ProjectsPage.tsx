import { GoDotFill } from "react-icons/go";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";

import Header from "@/components/Dashboard/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignedIn from "@/components/Dashboard/SignedIn";
import CreateNewProjectDialog from "@/components/Dashboard/CreateNewProjectDialog";
import { ProjectType } from "types";
import Loading from "@/components/Loading";

const ProjectsPage = () => {
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-projects"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-projects`,
        { withCredentials: true }
      );
      return data as { projects: ProjectType[] };
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
    mutationFn: async (id: string) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/delete-project`,
        { id },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SignedIn>
      <CreateNewProjectDialog
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <div className="w-full h-screen">
        <Header active="projects" />

        <div className="mt-10 px-20 flex flex-col gap-y-8 pb-10">
          <div className="flex gap-x-4 items-center">
            <Input placeholder="Search projects" />
            <Button onClick={() => setIsVisible(true)}>New Project</Button>
          </div>

          <div className="flex flex-wrap gap-x-7 items-center gap-y-6">
            {isPending ||
              (isLoading && (
                <div className="flex justify-center w-full">
                  <Loading />
                </div>
              ))}
            {data?.projects?.length === 0 && (
              <div className="w-full flex justify-center">
                <p className="text-rose-500 text-xl font-bold">
                  No projects to show.
                </p>
              </div>
            )}
            {!isPending &&
              data?.projects?.map((project) => {
                return (
                  <div
                    key={project.id}
                    className="border border-gray-300 w-[420px] rounded-lg py-3 px-6 flex flex-col gap-y-5"
                  >
                    <div className="flex flex-col gap-y-1.5">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/dashboard/projects/${project.id}`}
                          className="hover:text-green-600 delay-100 transition-all"
                        >
                          <p className="text-lg font-semibold">
                            {project.title}
                          </p>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <IoEllipsisVertical size={20} color="black" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>
                              {project.title}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="focus:bg-rose-500 focus:text-white cursor-pointer"
                              disabled={isPending}
                              onClick={() => {
                                const confirmation = confirm(
                                  "Do you really want to delete this project?"
                                );
                                if (confirmation) {
                                  deleteProject(project.id);
                                }
                              }}
                            >
                              Delete project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div
                        className={`${
                          project.status === "Live"
                            ? "bg-green-200"
                            : "bg-blue-200"
                        } w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
                      >
                        <GoDotFill
                          color={project.status === "Live" ? "green" : "blue"}
                          size={14}
                        />
                        <p
                          className={`${
                            project.status === "Live"
                              ? "text-green-600"
                              : "text-blue-600"
                          } capitalize text-sm font-semibold`}
                        >
                          {project.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          {/* {Math.floor(
                          (project.completedTasks * 100) / project.totalTasks
                        )} */}
                          50 % completed
                        </p>
                        <p className="font-semibold">
                          {/* {project.completedTasks}/{project.totalTasks} */}
                          20/40
                        </p>
                      </div>

                      <div className="flex w-full">
                        <div
                          className={`h-1.5 bg-green-600`}
                          style={{
                            width: "50%",
                            // width: `${
                            //   (project.completedTasks * 100) / project.totalTasks
                            // }%`,
                          }}
                        />
                        <div
                          className={`h-1.5 bg-gray-300`}
                          style={{
                            width: "50%",
                            // width: `${
                            //   100 -
                            //   (project.completedTasks * 100) / project.totalTasks
                            // }%`,
                          }}
                        />
                      </div>

                      <div className="flex gap-x-1.5">
                        <p className="text-gray-700 text-sm">Last updated</p>
                        <p className="font-semibold text-sm">
                          {formatDistanceToNowStrict(project.updatedAt)} ago
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default ProjectsPage;
