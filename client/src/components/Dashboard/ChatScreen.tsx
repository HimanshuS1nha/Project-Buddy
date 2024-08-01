import { IoEllipsisVertical, IoSend } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/useUser";
import { MessageType } from "types";
import { socket } from "@/lib/socket";

const ChatScreen = ({ id, name }: { id: string; name: string }) => {
  const { user } = useUser();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");

  const { data, error } = useQuery({
    queryKey: ["get-messages"],
    queryFn: async () => {
      if (id.length === 0) return null;
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-messages`,
        { id },
        { withCredentials: true }
      );

      return data as {
        messages: MessageType[];
      };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const handleSendMessage = useCallback(() => {
    if (message === "") return;

    const newMessage = {
      content: message,
      sentAt: new Date(),
      sentBy: user!.id,
      sentTo: id,
    };

    setMessages((prev) => {
      const newMessages: MessageType[] = [...prev, newMessage];
      return newMessages;
    });
    setMessage("");
    socket.emit("send-message", { message: newMessage, to: id, by: user!.id });
  }, [messages, message]);

  const handleReceiveMessage = useCallback(
    ({ message }: { message: MessageType }) => {
      setMessages((prev) => {
        const newMessages: MessageType[] = [...prev, message];
        return newMessages;
      });
    },
    [messages]
  );

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);
  return (
    <div className="w-full h-full relative pb-44">
      {id.length === 0 ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-green-600 text-4xl font-semibold">
            Welcome to Chat section!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-3 border-b border-b-gray-300 py-2">
            <p className="text-lg font-semibold">{name}</p>
            <IoEllipsisVertical size={24} color="black" />
          </div>

          <div className="flex flex-col gap-y-3 mt-2 px-4 w-full h-full overflow-y-auto">
            {messages.map((message, i) => {
              return (
                <div
                  className={`w-full flex ${
                    message.sentBy === user!.id ? "justify-end" : "justfy-start"
                  }`}
                  key={i}
                >
                  <div
                    className={`rounded-xl ${
                      message.sentBy === user!.id
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
            <Input
              placeholder="Type a message"
              className="w-[93%]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage}>
              <IoSend size={23} color="white" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatScreen;
