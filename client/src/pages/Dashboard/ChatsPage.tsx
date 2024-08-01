import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import Header from "@/components/Dashboard/Header";
import SignedIn from "@/components/Dashboard/SignedIn";
import ChatScreen from "@/components/Dashboard/ChatScreen";

const ChatsPage = () => {
  const { data, error } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-all-users`,
        { withCredentials: true }
      );

      return data as { users: { id: string; name: string }[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  return (
    <SignedIn>
      <div className="w-full h-screen overflow-hidden">
        <Header />

        <div className="flex w-full h-full border-t border-t-gray-300">
          <div className="w-[300px] h-full border-r border-r-gray-300 flex flex-col p-4 gap-y-7 overflow-y-auto">
            <p className="text-4xl font-bold text-green-600">Chats</p>
            <div className="px-4 flex flex-col gap-y-5">
              {data?.users.map((user) => {
                return (
                  <p
                    key={user.id}
                    className="text-lg font-semibold hover:text-green-600 delay-100 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedId(user.id);
                      setSelectedName(user.name);
                    }}
                  >
                    {user.name}
                  </p>
                );
              })}
            </div>
          </div>

          <ChatScreen id={selectedId} name={selectedName} />
        </div>
      </div>
    </SignedIn>
  );
};

export default ChatsPage;
