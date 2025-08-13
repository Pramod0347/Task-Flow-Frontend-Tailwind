// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", duration = 2500) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <ToastHost toasts={toasts} />
    </ToastCtx.Provider>
  );
}

function ToastHost({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-lg border px-3 py-2 shadow bg-white",
            t.type === "success" && "border-emerald-200",
            t.type === "error" && "border-red-200",
            t.type === "info" && "border-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "text-sm",
              t.type === "success" && "text-emerald-700",
              t.type === "error" && "text-red-700",
              t.type === "info" && "text-gray-700",
            ].join(" ")}
          >
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}
