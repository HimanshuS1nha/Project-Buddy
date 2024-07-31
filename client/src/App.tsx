import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Root/HomePage";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/login" Component={LoginPage} />
      <Route path="/signup" Component={SignupPage} />

      <Route path="/dashboard" Component={DashboardPage} />
    </Routes>
  );
};

export default App;
