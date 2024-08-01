import { GoDotFill } from "react-icons/go";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";

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

const ProjectsPage = () => {
  const dummyProjects = [
    {
      id: 1,
      title: "Test Project",
      status: "live",
      totalTasks: 40,
      completedTasks: 26,
      updatedAt: "1 day ago",
    },
    {
      id: 2,
      title: "Test Project",
      status: "building",
      totalTasks: 40,
      completedTasks: 2,
      updatedAt: "1 day ago",
    },
    {
      id: 3,
      title: "Test Project",
      status: "live",
      totalTasks: 40,
      completedTasks: 39,
      updatedAt: "1 day ago",
    },
    {
      id: 4,
      title: "Test Project",
      status: "live",
      totalTasks: 40,
      completedTasks: 14,
      updatedAt: "1 day ago",
    },
  ];
  return (
    <SignedIn>
      <div className="w-full h-screen">
        <Header active="projects" />

        <div className="mt-10 px-20 flex flex-col gap-y-8 pb-10">
          <div className="flex gap-x-4 items-center">
            <Input placeholder="Search projects" />
            <Button>New Project</Button>
          </div>

          <div className="flex flex-wrap gap-x-7 items-center gap-y-6">
            {dummyProjects.map((project) => {
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
                        <p className="text-lg font-semibold">{project.title}</p>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                          <IoEllipsisVertical size={20} color="black" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>{project.title}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-rose-500 focus:text-white cursor-pointer">
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div
                      className={`${
                        project.status === "live"
                          ? "bg-green-200"
                          : "bg-blue-200"
                      } w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
                    >
                      <GoDotFill
                        color={project.status === "live" ? "green" : "blue"}
                        size={14}
                      />
                      <p
                        className={`${
                          project.status === "live"
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
                        {Math.floor(
                          (project.completedTasks * 100) / project.totalTasks
                        )}
                        % completed
                      </p>
                      <p className="font-semibold">
                        {project.completedTasks}/{project.totalTasks}
                      </p>
                    </div>

                    <div className="flex w-full">
                      <div
                        className={`h-1.5 bg-green-600`}
                        style={{
                          width: `${
                            (project.completedTasks * 100) / project.totalTasks
                          }%`,
                        }}
                      />
                      <div
                        className={`h-1.5 bg-gray-300`}
                        style={{
                          width: `${
                            100 -
                            (project.completedTasks * 100) / project.totalTasks
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex gap-x-1.5">
                      <p className="text-gray-700 text-sm">Last updated</p>
                      <p className="font-semibold text-sm">
                        {project.updatedAt}
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
