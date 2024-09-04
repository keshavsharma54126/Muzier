"use client";

import { UseToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { Provider } from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts } = UseToast();

  return (
    <Provider>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}>
              <Toast {...toast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Provider>
  );
}
