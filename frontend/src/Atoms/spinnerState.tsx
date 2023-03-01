import { atom } from "recoil";

export const spinnerState = atom<boolean>({
  key: "spinnerState",
  default: false,
});