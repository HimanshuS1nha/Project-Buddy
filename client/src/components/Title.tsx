import React from "react";

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-3xl font-bold text-center text-green-600">
      {children}
    </h2>
  );
};

export default Title;
