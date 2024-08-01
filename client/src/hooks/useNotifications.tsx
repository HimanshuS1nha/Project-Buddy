import { NotificationType } from "../../types";
import { create } from "zustand";

type UseNotificationsType = {
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
};

export const useNotifications = create<UseNotificationsType>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));
