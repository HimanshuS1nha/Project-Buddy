import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { socket } from "@/lib/socket";
import { NotificationType } from "types";
import { useNotifications } from "@/hooks/useNotifications";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { setNotifications } = useNotifications();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);

  const handleError = useCallback((error: string) => toast.error(error), []);

  const { data, error, refetch } = useQuery({
    queryKey: ["get-notifications"],
    queryFn: async () => {
      if (!user?.isLoggedIn) return null;

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-notifications`,
        { withCredentials: true }
      );

      return data as { notifications: NotificationType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const handleRequestAccepted = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
    await queryClient.invalidateQueries({ queryKey: ["get-project"] });

    toast.success("Request accepted");
  }, []);

  useEffect(() => {
    if (user) {
      if (user?.isLoggedIn) {
        socket.auth = { id: user?.id };
        socket.connect();
        socket.on("error", handleError);
        socket.on("join-request", refetch);
        socket.on("request-accepted", handleRequestAccepted);

        setIsVisible(true);
      } else {
        navigate("/login", { replace: true });
      }
    }

    return () => {
      socket.disconnect();
      socket.off("error", handleError);
      socket.off("join-request", refetch);
      socket.off("request-accepted", handleRequestAccepted);
    };
  }, [user]);

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data]);

  if (isVisible) {
    return <>{children}</>;
  }
};

export default SignedIn;
