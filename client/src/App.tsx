import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Root/HomePage";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import ProjectsPage from "./pages/Dashboard/ProjectsPage";
import ChatsPage from "./pages/Dashboard/ChatsPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/login" Component={LoginPage} />
      <Route path="/signup" Component={SignupPage} />

      <Route path="/dashboard/projects" Component={ProjectsPage} />
      <Route path="/dashboard/settings" Component={SettingsPage} />
      <Route path="/dashboard/chats" Component={ChatsPage} />
    </Routes>
  );
};

export default App;
