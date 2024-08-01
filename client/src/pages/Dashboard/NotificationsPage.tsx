import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import Header from "@/components/Dashboard/Header";
import { Button } from "@/components/ui/button";
import SignedIn from "@/components/Dashboard/SignedIn";

const NotificationsPage = () => {
  return (
    <SignedIn>
      <div className="w-full h-screen">
        <Header />

        <div className="mt-10 px-40 flex flex-col gap-y-8 pb-10">
          <div className="flex flex-col gap-y-3">
            <p className="text-4xl font-semibold text-green-600">
              Notifications
            </p>
            <div className="w-full h-[0.5px] bg-black" />
          </div>

          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-semibold">
                  Invite to join project : Test Project
                </p>
                <p className="text-gray-700 text-sm">Invite by Random User</p>
              </div>

              <div className="flex gap-x-3 items-center">
                <Button variant={"destructive"}>
                  <FaXmark size={18} />
                </Button>
                <Button>
                  <FaCheck size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default NotificationsPage;
