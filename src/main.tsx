import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./components/provider/theme";
import { TooltipProvider } from "./components/ui/tooltip";
import { I18nextProvider } from "react-i18next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router";
import i18n from "./i18n";
import "./styles/index.scss";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const queryClient = new QueryClient();
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider defaultTheme="dark">
            <TooltipProvider>
              <RouterProvider router={router} />
            </TooltipProvider>
          </ThemeProvider>
        </I18nextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
