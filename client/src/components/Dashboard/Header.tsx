import { FaRegBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoFolderOpen } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";

const Header = ({ active }: { active?: "projects" | "settings" }) => {
  const { notifications } = useNotifications();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login", { replace: true });
      setUser(null);
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
    <div className="h-[8vh] px-6 flex items-center justify-between">
      <div className="flex gap-x-10 items-center">
        <div className="flex gap-x-4 items-center">
          <p className="text-xl font-semibold">
            Project<span className="text-green-600 font-bold">Buddy</span>
          </p>
          <p className="text-gray-700">/</p>
          <div className="flex items-center gap-x-2">
            <div className="bg-green-600 w-8 h-8 rounded-full flex justify-center items-center">
              <p className="text-white">{user?.name?.[0]}</p>
            </div>
            <p className="font-semibold">{user?.name}</p>
          </div>
        </div>

        <div className="flex gap-x-7">
          <Link
            to={"/dashboard/projects"}
            className={`flex gap-x-2 items-center relative ${
              active === "projects" ? "" : "hover:bg-green-100"
            } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
          >
            <IoFolderOpen color="black" size={23} />
            <p className="font-semibold">Projects</p>
            {active === "projects" && (
              <div className="w-full h-[3.5px] bg-green-600 absolute -bottom-2" />
            )}
          </Link>
          <Link
            to={"/dashboard/settings"}
            className={`flex gap-x-2 items-center relative ${
              active === "settings" ? "" : "hover:bg-green-100"
            } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
          >
            <IoMdSettings color="black" size={23} />
            <p className="font-semibold">Account Settings</p>
            {active === "settings" && (
              <div className="w-full h-[3.5px] bg-green-600 absolute -bottom-2" />
            )}
          </Link>
        </div>
      </div>

      <div className="flex gap-x-5 items-center">
        <Link
          to={"/dashboard/chats"}
          className="hover:scale-105 delay-100 transition-all"
        >
          <IoChatboxEllipsesOutline color="black" size={23} />
        </Link>
        <Link
          to={"/dashboard/notifications"}
          className="hover:scale-105 delay-100 transition-all relative"
        >
          <FaRegBell size={23} color="black" />
          {notifications.length > 0 && (
            <div className="w-2 h-2 bg-green-600 rounded-full absolute top-0 right-0" />
          )}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-green-600 w-8 h-8 rounded-full flex justify-center items-center">
              <p className="text-white">{user?.name?.[0]}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              disabled={isPending}
              className="cursor-pointer focus:bg-rose-500 focus:text-white"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
