import { create } from "zustand";

import { UserType } from "types";

type UseUserType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const useUser = create<UseUserType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
