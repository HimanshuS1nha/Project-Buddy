import { Routes, Route } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import HomePage from "./pages/Root/HomePage";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import ProjectsPage from "./pages/Dashboard/ProjectsPage";
import ChatsPage from "./pages/Dashboard/ChatsPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";
import NotificationsPage from "./pages/Dashboard/NotificationsPage";
import ProjectPage from "./pages/Dashboard/ProjectPage";
import { useUser } from "./hooks/useUser";
import { useEffect } from "react";

const App = () => {
  const { user, setUser } = useUser();

  const { mutate: checkLoginStatus } = useMutation({
    mutationKey: ["is-logged-in"],
    mutationFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/is-logged-in`,
        { withCredentials: true }
      );
      return data as { user: { id: string; name: string; email: string } };
    },
    onSuccess: (data) => {
      setUser({ ...data.user, isLoggedIn: true });
    },
  });

  useEffect(() => {
    if (!user?.isLoggedIn) {
      checkLoginStatus();
    }
  }, []);
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/login" Component={LoginPage} />
      <Route path="/signup" Component={SignupPage} />

      <Route path="/dashboard/projects" Component={ProjectsPage} />
      <Route path="/dashboard/settings" Component={SettingsPage} />
      <Route path="/dashboard/chats" Component={ChatsPage} />
      <Route path="/dashboard/notifications" Component={NotificationsPage} />
      <Route path="/dashboard/projects/:id" Component={ProjectPage} />
    </Routes>
  );
};

export default App;
