import { IoEllipsisVertical, IoSend } from "react-icons/io5";

import Header from "@/components/Dashboard/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatsPage = () => {
  const dummyUsers = [
    {
      id: 1,
      name: "Random User 1",
    },
    {
      id: 2,
      name: "Random User 2",
    },
  ];

  const messages = [
    {
      id: 1,
      sentBy: 1,
      sentTo: 2,
      sentAt: "12:00AM",
      content: "Hello",
    },
    {
      id: 2,
      sentBy: 2,
      sentTo: 1,
      sentAt: "12:01AM",
      content: "Hi",
    },
  ];
  return (
    <div className="w-full h-screen overflow-hidden">
      <Header />

      <div className="flex w-full h-full border-t border-t-gray-300">
        <div className="w-[300px] h-full border-r border-r-gray-300 flex flex-col p-4 gap-y-7 overflow-y-auto">
          <p className="text-4xl font-bold text-green-600">Chats</p>
          <div className="px-4 flex flex-col gap-y-5">
            {dummyUsers.map((user) => {
              return (
                <p
                  key={user.id}
                  className="text-lg font-semibold hover:text-green-600 delay-100 transition-all cursor-pointer"
                >
                  {user.name}
                </p>
              );
            })}
          </div>
        </div>

        <div className="w-full h-full relative pb-44">
          <div className="flex items-center justify-between px-3 border-b border-b-gray-300 py-2">
            <p className="text-lg font-semibold">Random User</p>
            <IoEllipsisVertical size={24} color="black" />
          </div>

          <div className="flex flex-col gap-y-3 mt-2 px-4 w-full h-full overflow-y-auto">
            {messages.map((message) => {
              return (
                <div
                  className={`w-full flex ${
                    message.sentBy === 1 ? "justify-end" : "justfy-start"
                  }`}
                  key={message.id}
                >
                  <div
                    className={`rounded-xl ${
                      message.sentBy === 1
                        ? "bg-green-600 rounded-br-none"
                        : "bg-black rounded-tl-none"
                    } p-3 min-w-[10%] max-w-[70%] shadow-md shadow-gray-300`}
                  >
                    <p className="text-white">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-[8.9%] w-full px-2 flex gap-x-4">
            <Input placeholder="Type a message" className="w-[93%]" />
            <Button>
              <IoSend size={23} color="white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
