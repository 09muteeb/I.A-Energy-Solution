import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastContainer");
  return context;
}

let toastIdCounter = 0;

export default function ToastContainer({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-5 py-4 rounded min-w-[300px] max-w-[400px] animate-fade-in"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderLeft:
                toast.type === "success"
                  ? "3px solid var(--success)"
                  : toast.type === "error"
                  ? "3px solid var(--error)"
                  : "3px solid var(--accent)",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
            ) : toast.type === "error" ? (
              <AlertCircle size={18} style={{ color: "var(--error)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--accent)" }} />
            )}
            <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
