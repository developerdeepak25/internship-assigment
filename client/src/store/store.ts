import { create } from "zustand";
import createAuthSlice, { AuthStore } from "./slice/authSlice";

const useStore = create<AuthStore>((...a) => ({
  ...createAuthSlice(...a),
}));

export default useStore;
