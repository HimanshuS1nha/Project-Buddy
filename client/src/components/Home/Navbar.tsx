import { Link } from "react-router-dom";

import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-around items-center h-[8vh]">
      <p className="text-xl font-semibold">
        Project<span className="text-green-600 font-bold">Buddy</span>
      </p>

      <div className="flex gap-x-4 items-center">
        <Button variant={"ghost"} asChild>
          <Link to={"/login"}>Login</Link>
        </Button>
        <Button asChild>
          <Link to={"/signup"}>Signup</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
