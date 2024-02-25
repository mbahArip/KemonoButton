import { Kemono } from "@types";
import toast from "react-hot-toast";
import checkUser from "../utils/checkUser";
import logger from "../utils/logger";

export default async function fantia(
  toastId: string
): Promise<Kemono.Creator | null> {
  try {
    if (!window)
      throw new Error("Window object not found, are you running in a browser?");

    let id = null;
    /**
     * Select from name of the fanclub, it should be XXXX (Kemono Name)
     * So we can get the Kemono name, and check it from the database.
     */
    const selector = document.querySelector("h1.fanclub-name");
    if (!selector)
      throw new Error(
        "Failed to get id from fantia, please report this issue to the developer."
      );
    id = selector.innerHTML.split(" (")[1].split(")")[0];

    /**
     * Select from the page tab, and get the fanclub id from the URL.
     */
    // const selector = document.querySelectorAll(
    //   "nav.scroll-tabs > div.scroll-tabs-main > a.tab-item"
    // );
    // if (!selector)
    //   throw new Error(
    //     "Failed to get id from fantia, please report this issue to the developer."
    //   );
    // let selectedHref = null;
    // for (const element of selector) {
    //   if (element.getAttribute("href")?.includes("fanclubs")) {
    //     selectedHref = element.getAttribute("href");
    //     break;
    //   }
    // }
    // if (!selectedHref)
    //   throw new Error(
    //     "Failed to get id from fantia, please report this issue to the developer."
    //   );
    // id = selectedHref.split("fanclubs/")[1].split("/")[0];
    // console.log(id);
    if (!id)
      throw new Error(
        "Failed to get id from fantia, please report this issue to the developer."
      );

    const getFromApi = await checkUser("fantia", id);
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
