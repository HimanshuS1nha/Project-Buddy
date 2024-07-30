import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-around items-center h-[8vh]">
      <p className="text-xl font-semibold">
        Project<span className="text-green-600 font-bold">Buddy</span>
      </p>

      <div className="flex gap-x-4 items-center">
        <Button variant={"ghost"}>Login</Button>
        <Button>Signup</Button>
      </div>
    </nav>
  );
};

export default Navbar;
