import { Kemono } from "@types";
import toast from "react-hot-toast";
import checkUser from "../utils/checkUser";
import logger from "../utils/logger";

export default async function patreon(
  toastId: string
): Promise<Kemono.Creator | null> {
  try {
    if (!window)
      throw new Error("Window object not found, are you running in a browser?");

    /**
     * Want to use window object, but sometimes it will throw an error.
     * That's why we get the data from nextjs page props instead.
     */
    // const id = (window as any).patreon.bootstrap.campaign.data.relationships
    //   .creator.data.id;
    const scriptElement = document.querySelector("script#__NEXT_DATA__");
    if (!scriptElement) throw new Error("Failed to get nextjs page props");
    const json = JSON.parse(scriptElement.innerHTML);
    const id =
      json.props.pageProps.bootstrapEnvelope.bootstrap.campaign.data
        .relationships.creator.data.id;
    if (!id)
      throw new Error(
        "Failed to get id from patreon, please report this issue to the developer."
      );

    const getFromApi = await checkUser("patreon", id);
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
