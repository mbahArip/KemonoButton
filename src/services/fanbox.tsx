import { Kemono } from "@types";
import toast from "react-hot-toast";
import checkUser from "../utils/checkUser";
import logger from "../utils/logger";

export default async function fanbox(
  toastId: string
): Promise<Kemono.Creator | null> {
  try {
    if (!window)
      throw new Error("Window object not found, are you running in a browser?");

    let username = null;
    const url = window.location.href;
    const subdomainRegex = /https:\/\/(.*)\.fanbox.cc/;
    const pathnamesRegex = /https:\/\/www\.fanbox.cc\/@(.*)/;
    const subdomainMatch = url.match(subdomainRegex);
    const pathnamesMatch = url.match(pathnamesRegex);
    if (subdomainMatch && subdomainMatch[1] !== "www") {
      username = subdomainMatch[1];
    }
    if (!username && pathnamesMatch && pathnamesMatch[1]) {
      const pathname = pathnamesMatch[1].split("/")[0];
      username = pathname;
    }
    if (!username)
      throw new Error(
        "Failed to get username from fanbox, please report this issue to the developer."
      );

    const getFromApi = await checkUser("fanbox", username);
    if (!getFromApi) throw new Error("Can't find user on kemono");
    toast.success(`User found, ${getFromApi.name}`, { id: toastId });
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
