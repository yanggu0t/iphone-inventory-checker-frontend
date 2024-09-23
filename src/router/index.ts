import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MainLayout, AppLayout } from "../layouts";
import { App, Home, NotFound } from "../pages";
import Models from "@/pages/Models";
import Locales from "@/pages/Locales";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppLayout,
});

const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: App,
});

const modelsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/models",
  component: Models,
});

const localesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/locales",
  component: Locales,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([
  appRoute,
  homeRoute.addChildren([appIndexRoute, modelsRoute, localesRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
