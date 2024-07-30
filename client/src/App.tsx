import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Root/HomePage";
import LoginPage from "./pages/Auth/LoginPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" Component={HomePage} />

      <Route path="/login" Component={LoginPage} />
    </Routes>
  );
};

export default App;
