import toast from "react-hot-toast";

export default async function awaitForElement(
  selector: string,
  toastId: string
): Promise<Element | null> {
  toast.loading("Waiting for element to appear...", {
    id: toastId,
  });
  let attempt: number = 0;
  const element = document.querySelector(selector);
  return new Promise((res, rej) => {
    if (element) {
      attempt = 0;
      res(element);
    } else {
      if (attempt > 10) {
        toast.error(
          <div className="flex flex-col">
            <b>Failed to find element</b>
            <span className="text-sm">
              We can&apos;t find the element that contains the data, please
              report this issue to the developer.
            </span>
          </div>,
          { id: toastId }
        );
        rej(null);
      }
      attempt++;
      toast.loading(`Waiting for element to appear... (Attempt #${attempt})`, {
        id: toastId,
      });
      setTimeout(() => {
        res(awaitForElement(selector, toastId));
      }, 1000);
    }
  });
}
