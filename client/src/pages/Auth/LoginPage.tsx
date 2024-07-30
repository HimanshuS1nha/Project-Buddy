import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  return (
    <div className="bg-gray-100 h-screen overflow-y-hidden flex justify-center items-center">
      <div className="w-[35%] rounded-xl bg-white flex flex-col p-6 gap-y-9">
        <p className="text-4xl font-bold text-center">
          Project<span className="text-green-600">Buddy</span>
        </p>

        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold">Welcome back!</p>
          <p className="text-gray-700 text-sm">Login to your account</p>
        </div>

        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex flex-col gap-y-2.5">
            <Label>Email</Label>
            <Input placeholder="Enter your email" type="email" />
          </div>
          <div className="flex flex-col gap-y-2.5">
            <Label>Password</Label>
            <Input placeholder="Enter your password" type="password" />
          </div>

          <Button>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
