import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      if (user?.isLoggedIn) {
        setIsVisible(true);
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user]);

  if (isVisible) {
    return <>{children}</>;
  }
};

export default SignedIn;
