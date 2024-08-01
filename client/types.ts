export type UserType = {
  name: string;
  email: string;
  isLoggedIn: boolean;
};

export type ProjectType = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  updatedAt: Date;
  status: "Live" | "Building";
};
