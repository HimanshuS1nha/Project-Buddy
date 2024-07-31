import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Root/HomePage";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import ProjectsPage from "./pages/Dashboard/ProjectsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/login" Component={LoginPage} />
      <Route path="/signup" Component={SignupPage} />

      <Route path="/dashboard/projects" Component={ProjectsPage} />
    </Routes>
  );
};

export default App;
