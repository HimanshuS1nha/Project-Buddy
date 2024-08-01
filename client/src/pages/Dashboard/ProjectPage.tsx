import { MdOutlineInsertComment } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import Header from "@/components/Dashboard/Header";
import { Button } from "@/components/ui/button";
import SignedIn from "@/components/Dashboard/SignedIn";
import { ProjectType } from "types";
import Loading from "@/components/Loading";

const ProjectPage = () => {
  const params = useParams() as { id: string };
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-project"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-project`,
        { id: params.id },
        { withCredentials: true }
      );
      console.log(data);
      return data as { project: ProjectType };
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
  return (
    <SignedIn>
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
                    className={`bg-green-200 w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
                  >
                    <GoDotFill color={"green"} size={14} />
                    <p
                      className={`text-green-600 capitalize text-sm font-semibold`}
                    >
                      live
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4 items-center">
                  <Button>Edit project</Button>
                  <Button>Add team members</Button>
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
                <div className="flex flex-col gap-y-5 border border-gray-300 p-5 rounded-lg items-center">
                  <p className="text-2xl font-semibold text-rose-500">
                    Pending
                  </p>

                  <div className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]">
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Create project</p>
                      <p className="text-xs text-gray-700">
                        20 Jun 2024 - 22 Jun 2024
                      </p>
                    </div>

                    <MdOutlineInsertComment size={24} color="black" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 border border-gray-300 p-5 rounded-lg items-center">
                  <p className="text-2xl font-semibold text-blue-600">Review</p>

                  <div className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]">
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Review project</p>
                      <p className="text-xs text-gray-700">
                        20 Jun 2024 - 22 Jun 2024
                      </p>
                    </div>

                    <MdOutlineInsertComment size={24} color="black" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 border border-gray-300 p-5 rounded-lg items-center">
                  <p className="text-2xl font-semibold text-green-600">
                    Completed
                  </p>

                  <div className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[250px]">
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Completed project</p>
                      <p className="text-xs text-gray-700">
                        20 Jun 2024 - 22 Jun 2024
                      </p>
                    </div>

                    <MdOutlineInsertComment size={24} color="black" />
                  </div>
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
