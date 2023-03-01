import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const accountState = atom({
  key: "accountState",
  default: '',
  effects_UNSTABLE: [persistAtom]
});