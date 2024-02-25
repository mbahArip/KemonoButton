import { Kemono } from "@types";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import fanbox from "./services/fanbox";
import fansly from "./services/fansly";
import fantia from "./services/fantia";
import onlyfans from "./services/onlyfans";
import patreon from "./services/patreon";
import logger from "./utils/logger";

export default function App() {
  const pathRecheck = useMemo<Record<Kemono.Service, boolean>>(
    () => ({
      afdian: false,
      boosty: false,
      discord: false,
      dlsite: false,
      fantia: false,
      fanbox: true,
      fansly: false,
      gumroad: false,
      onlyfans: false,
      patreon: false,
      subscribestar: false,
    }),
    []
  );
  const [pathname, setPathname] = useState<string>("");
  const [isCreatorPage, setIsCreatorPage] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [status, setStatus] = useState<"loading" | "error" | "idle">("loading");
  const [found, setFound] = useState<Kemono.Creator | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const toastId = useRef<string>("");
  const interval = useRef<number>(0);
  const timeout = useRef<number>(0);

  useEffect(() => {
    if (!window) {
      logger.error("Window object not found, are you running in a browser?");
      toast.error("Window object not found, are you running in a browser?");
      return;
    }
    let needRecheck = false;
    for (const key in pathRecheck) {
      if (window.location.origin.toLowerCase().includes(key)) {
        needRecheck = pathRecheck[key as Kemono.Service];
        break;
      }
    }
    if (needRecheck) {
      interval.current = setInterval(() => {
        if (window.location.pathname !== pathname) {
          setPathname(window.location.pathname);
        }
      }, 1000);
    }
    timeout.current = setTimeout(() => {
      const origin = window.location.origin.toLowerCase();
      logger.log(`${origin} detected`);
      logger.log("Preparing to check user on database...");
      toastId.current = `toast-${origin}`;
      toast.loading("Checking this user on database...", {
        id: toastId.current,
      });

      (async () => {
        let result: Kemono.Creator | null = null;

        // COOMER
        if (origin.includes("onlyfans")) {
          result = await onlyfans(toastId.current);
          setIsCreatorPage(true);
        }
        if (origin.includes("fansly")) {
          result = await fansly(toastId.current);
          setIsCreatorPage(true);
        }

        // KEMONO
        if (origin.includes("fantia")) {
          const pathname = window.location.pathname;
          if (
            ((pathname.includes("fanclubs") ||
              pathname.includes("posts") ||
              pathname.includes("products")) &&
              /\d/.test(pathname)) ||
            document.querySelector(".fanclub-show-header")
          ) {
            result = await fantia(toastId.current);
            setIsCreatorPage(true);
          } else {
            result = null;
            setIsCreatorPage(false);
            toast.dismiss(toastId.current);
          }
        }
        if (origin.includes("fanbox")) {
          result = await fanbox(toastId.current);
          setIsCreatorPage(true);
        }
        if (origin.includes("patreon")) {
          result = await patreon(toastId.current);
          setIsCreatorPage(true);
        }

        if (result) {
          logger.log("User found on database");
          const avatar = (result.url || "")
            .replace("https://", "https://img.")
            .replace("su/", "su/icons/")
            .replace("user/", "");
          setAvatar(avatar);
          setStatus("idle");
          setFound(result);
        } else {
          logger.error("User not found on database");
          setStatus("error");
          setFound(null);
          setAvatar("");
        }
        setLoaded(true);
      })();
    }, 250); // Delay to prevent flickering and to make sure the page is fully loaded

    return () => {
      // setLoaded(false);
      clearTimeout(timeout.current);
      clearInterval(interval.current);
    };
  }, [pathname]);

  return (
    <>
      <div
        id="container"
        className={`fixed antialiased z-[69420] bottom-16 w-full max-w-sm ${
          loaded && isCreatorPage ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-150 ease-in-out drop-shadow-lg`}
      >
        <div
          id="result"
          className="fixed bottom-12 left-2 w-fit h-fit text-sm py-2 px-4 bg-zinc-900 drop-shadow-md backdrop-blur-lg border border-zinc-800 text-zinc-400 rounded-lg"
        >
          {found && isCreatorPage ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={found.name}
                  className="w-10 h-10 rounded"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold">{found.name}</h2>
                  <span className="text-zinc-400 col-span-2">
                    Favorited: <b>{found.favorited}</b>
                  </span>
                </div>
              </div>
              <a
                href={found.url || ""}
                role="button"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 !text-white w-full bg-blue-500 hover:bg-blue-400 hover:text-zinc-50 rounded grid place-items-center cursor-pointer text-base"
              >
                Visit {new URL(found.url || "").hostname.split(".")[0]} page
              </a>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0">
                <span className="text-zinc-400">
                  Indexed at:{" "}
                  <b>{new Date(found.indexed * 1000).toLocaleDateString()}</b>
                </span>
                <span className="text-zinc-400">
                  Updated at:{" "}
                  <b>{new Date(found.updated * 1000).toLocaleDateString()}</b>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-xs">
              <b className="text-sm">There is no user found on database.</b>
              <br />
              If you think this a mistake, please report to the developer.
            </p>
          )}

          <hr className="opacity-25 my-1.5" />

          <div className="flex items-center gap-1 justify-center">
            <b>Support me</b> on{" "}
            <a
              href="https://ko-fi.com/mbaharip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 cursor-pointer"
            >
              Ko-fi
            </a>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <b>Report problem</b>{" "}
            <a
              href="https://github.com/mbahArip/KemonoButton/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 cursor-pointer"
            >
              here
            </a>
          </div>
        </div>
      </div>
      <div
        id="status-bar"
        className="fixed text-base z-[69420] bottom-[calc(5rem_-_0.5rem)] left-2 w-fit h-fit py-1 px-2 flex items-center gap-1.5 text-zinc-400 bg-zinc-900 drop-shadow-md backdrop-blur-lg border border-zinc-800 rounded-lg"
      >
        <div
          className="cursor-pointer"
          onClick={() => {
            setLoaded((prev) => !prev);
          }}
        >
          <Eye show={loaded} />
        </div>
        <span className="select-none">KemonoButton</span>
        <div className="flex items-center gap-1.5">
          {status === "loading" && <Loading />}
          {status === "error" && (
            <div
              className="w-4 h-4 grid place-items-center"
              title={"Error, please check console for more information"}
            >
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse absolute" />
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute" />
            </div>
          )}
          {status === "idle" && (
            <div
              className="w-4 h-4 grid place-items-center"
              title={"KemonoButton working as intended"}
            >
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse absolute" />
              <div className="w-2 h-2 bg-green-600 rounded-full animate-ping absolute" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Loading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
      >
        <animateTransform
          attributeName="transform"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        ></animateTransform>
      </path>
    </svg>
  );
}

function Eye({ show = true }: { show: boolean }) {
  if (show) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
