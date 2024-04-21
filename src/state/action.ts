import { atom } from "jotai";
import { HTTP_VERBS } from "../api/requests";

export const actionBodyAtom = atom("");
export const actionVerbAtom = atom(HTTP_VERBS.GET);
export const actionUriAtom = atom("");