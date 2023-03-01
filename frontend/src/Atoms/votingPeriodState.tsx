import { atom } from "recoil";

export const votingPeriodState = atom<{
    startTimestamp: Date | null,
    endTimestamp: Date | null
  }>({
  key: "votingPeriodState",
  default: {
    startTimestamp: null,
    endTimestamp: null
  },
});