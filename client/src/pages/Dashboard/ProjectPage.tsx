import { MdOutlineInsertComment } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

import Header from "@/components/Dashboard/Header";
import { Button } from "@/components/ui/button";
import SignedIn from "@/components/Dashboard/SignedIn";

const ProjectPage = () => {
  return (
    <SignedIn>
      <div className="w-full h-screen">
        <Header active="projects" />

        <div className="px-40 mt-10 flex flex-col gap-y-12">
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2 items-center">
              <p className="text-4xl font-semibold text-green-600">
                Test Project
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
              <Button variant={"destructive"}>Delete project</Button>
            </div>
          </div>

          <div className="flex gap-x-12 justify-center">
            <div className="flex flex-col gap-y-5 border border-gray-300 p-5 rounded-lg items-center">
              <p className="text-2xl font-semibold text-rose-500">Pending</p>

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
              <p className="text-2xl font-semibold text-green-600">Completed</p>

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
        </div>
      </div>
    </SignedIn>
  );
};

export default ProjectPage;
