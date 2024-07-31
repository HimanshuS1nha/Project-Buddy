import { FaRegBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoFolderOpen } from "react-icons/io5";
import { Link } from "react-router-dom";

const Header = ({ active }: { active?: "projects" | "settings" }) => {
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
              <p className="text-white">H</p>
            </div>
            <p className="font-semibold">Himanshu Sinha</p>
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
        <FaRegBell size={23} color="black" />
        <div className="bg-green-600 w-8 h-8 rounded-full flex justify-center items-center">
          <p className="text-white">H</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
