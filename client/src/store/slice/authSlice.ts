import { StateCreator } from "zustand";

type AuthType = {
  isAuthenticated: boolean;
};
export type AuthStore = {
  auth: AuthType;
  login: () => void;
};

const createAuthSlice: StateCreator<AuthStore> = (set) => ({
  auth: { isAuthenticated: false },
  login: () => set({ auth: { isAuthenticated: true } }),
});

export default createAuthSlice;
