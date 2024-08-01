export type UserType = {
  id: string;
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

export type NotificationType = {
  id: string;
  userEmail: string;
  projectId: string;
  senderEmail: string;
};

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  assignedTo: string;
  status: "Pending" | "Review" | "Completed";
};

export type MessageType = {
  id?: string;
  sentBy: string;
  sentTo: string;
  sentAt: Date;
  content: string;
};
