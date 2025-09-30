import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text-primary)",
      }}
    >
      <Outlet />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "var(--color-success-500)",
              secondary: "var(--color-text-primary)",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "var(--color-danger-500)",
              secondary: "var(--color-text-primary)",
            },
          },
        }}
      />
    </div>
  );
};

export default RootLayout;
