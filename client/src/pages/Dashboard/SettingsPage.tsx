import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

import Header from "@/components/Dashboard/Header";
import { Button } from "@/components/ui/button";
import SignedIn from "@/components/Dashboard/SignedIn";
import ChangePasswordDialog from "@/components/Dashboard/ChangePasswordDialog";

const SettingsPage = () => {
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);

  const { mutate: deleteAllProjects, isPending } = useMutation({
    mutationKey: ["delete-all-projects"],
    mutationFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/delete-all-projects`,
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
      <ChangePasswordDialog isVisible={isVisible} setIsVisible={setIsVisible} />
      <div className="w-full h-screen">
        <Header active="settings" />

        <div className="mt-10 px-40 flex flex-col gap-y-8 pb-10">
          <div className="flex flex-col gap-y-3">
            <p className="text-4xl font-semibold text-green-600">Settings</p>
            <div className="w-full h-[0.5px] bg-black" />
          </div>

          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-semibold">Change Password</p>
                <p className="text-gray-700 text-sm">
                  Change your current password
                </p>
              </div>

              <Button onClick={() => setIsVisible(true)}>
                Change password
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-semibold">Delete Projects</p>
                <p className="text-gray-700 text-sm">
                  Delete all your projects{" "}
                  <span className="text-rose-500 font-semibold">
                    (This action is irreversible)
                  </span>
                </p>
              </div>

              <Button
                variant={"destructive"}
                disabled={isPending}
                onClick={() => {
                  const confirmation = confirm(
                    "Do you really want to delete all projects?"
                  );
                  if (confirmation) {
                    deleteAllProjects();
                  }
                }}
              >
                Delete projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default SettingsPage;
