import { toast } from "react-toastify";

const showToast = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
  });
};

export default showToast;
