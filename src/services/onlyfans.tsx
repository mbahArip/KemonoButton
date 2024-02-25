import { Kemono } from "@types";
import toast from "react-hot-toast";
import checkUser from "../utils/checkUser";
import logger from "../utils/logger";

export default async function onlyfans(
  toastId: string
): Promise<Kemono.Creator | null> {
  try {
    if (!window)
      throw new Error("Window object not found, are you running in a browser?");

    const username = window.location.href
      .split("onlyfans.com/")[1]
      .split("/")[0];
    if (!username) throw new Error("Failed to parse username from URL");

    const getFromApi = await checkUser("onlyfans", username);
    if (!getFromApi) throw new Error("Can't find user on coomer");
    toast.success(`User found, ${getFromApi.name}`, {
      id: toastId,
    });
    return getFromApi;
  } catch (error) {
    const e = error as Error;
    logger.error(e.message);
    let msg = e.message;
    if (msg.includes("404")) {
      msg = "There is no user found on database";
    }
    toast.error(msg, { id: toastId });
    return null;
  }
}
