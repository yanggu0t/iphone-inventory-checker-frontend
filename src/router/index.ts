import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MainLayout, AppLayout } from "../layouts";
import { Models, Search, Home, NotFound } from "../pages";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppLayout,
});

const searchRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/search",
  component: Search,
});

const preferenceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/preference",
  component: Search,
});

const modelsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/models",
  component: Models,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const routeTree = rootRoute.addChildren([
  appRoute,
  homeRoute.addChildren([searchRoute, modelsRoute, preferenceRoute]),
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
