import { atom } from "recoil";

export const authToken = atom({
    key: "authToken",
    default: "",
});
