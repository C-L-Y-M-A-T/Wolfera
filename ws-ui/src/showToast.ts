import { toast, ToastOptions } from "react-toastify";

const showToast = (
  msg: string,
  logLevel: "info" | "success" | "warning" | "error" = "info",
) => {
  const toastOptions: ToastOptions = {
    position: "bottom-left",
    autoClose: 2500,
  };
  switch (logLevel) {
    case "info":
      toast.info(msg, toastOptions);
      break;
    case "success":
      toast.success(msg, toastOptions);
      break;
    case "warning":
      toast.warn(msg, toastOptions);
      break;
    case "error":
      toast.error(msg, toastOptions);
      break;
    default:
      toast(msg, toastOptions);
      break;
  }
  return {
    showToast,
  };
};

export default showToast;
