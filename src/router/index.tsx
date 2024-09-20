import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MainLayout } from "../layouts";
import { App, Home, NotFound } from "../pages";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: App,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([appRoute, homeRoute]);

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
