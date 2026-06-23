import toast from "react-hot-toast";

export const notifySuccess = (message: string): void => {
  toast.success(message, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
  });
};

export const notifyError = (message: string): void => {
  toast.error(message, {
    style: { borderRadius: "10px", background: "#ff4b4b", color: "#fff" },
  });
};
