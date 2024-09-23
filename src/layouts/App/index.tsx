import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn, getLocalStorage } from "@/utils/tools";
import { useStore } from "@/stores";
import AnimatedBackground from "@/components/core/animated-background";
import {
  MapPin,
  SlidersHorizontal,
  Smartphone,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { LOCAL_STORAGE } from "@/utils/enums";
import { CountrySelector } from "@/components/share";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/service/api/apple";

const AppLayout = () => {
  const langTag = getLocalStorage(
    LOCAL_STORAGE.APPLE_LANG_TAG,
  ) as unknown as string;
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const isAppRoot = pathname === "/app" || pathname === "/app/";
  const isCollapsed = useStore((state) => state.apple.isCollapsed);
  const setIsCollapsed = useStore((state) => state.apple.setIsCollapsed);
  const setConfig = useStore((state) => state.apple.setConfig);

  const config = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const response = await getConfig();
      setConfig(response.data);
      return response.data;
    },
    enabled: !!langTag,
    refetchOnWindowFocus: false,
  });

  if (!langTag) return <CountrySelector />;

  return (
    <ResizablePanelGroup className="rounded-lg border" direction="horizontal">
      <ResizablePanel
        collapsedSize={4.5}
        collapsible={true}
        minSize={15}
        maxSize={25}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
        )}
        onCollapse={() => {
          setIsCollapsed(true);
        }}
        onResize={() => {
          setIsCollapsed(false);
        }}
      >
        {isAppRoot ? (
          <div className="flex h-[52px] items-center gap-2 p-4">
            <Menu />
            {!isCollapsed && <Typography variant="h5">Menu</Typography>}
          </div>
        ) : (
          <div
            onClick={() => navigate({ to: "/app" })}
            className="flex h-[52px] cursor-pointer items-center gap-2 rounded-lg p-4 duration-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ChevronLeft />
            {!isCollapsed && <Typography variant="h5">Back</Typography>}
          </div>
        )}
        <Separator />
        <AnimatedBackground
          className="m-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
          enableHover
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
        >
          {sidebar.map((item) => {
            return (
              <div
                key={item.key}
                data-id={`card-${item.key}`}
                className="w-full cursor-pointer"
              >
                <div className="flex w-full select-none flex-col p-4">
                  <h3 className="flex items-center gap-2 text-base font-medium text-zinc-800 dark:text-zinc-50">
                    <item.icon />
                    {!isCollapsed && item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </AnimatedBackground>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={40}>
        <div className="flex h-[52px] items-center justify-between p-4">
          <Typography variant="h5">iphone-stock-checker</Typography>
          <Typography variant="inlineCode">{langTag}</Typography>
        </div>
        <Separator />
        <Outlet />
      </ResizablePanel>
      {true && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={25}>
            <Typography variant="h5" className="flex h-[52px] items-center p-4">
              Live console
            </Typography>
            <Separator />
            <p>live</p>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default AppLayout;

interface SidebarItem {
  key: string;
  title: string;
  path: string;
  icon: LucideIcon;
}

const sidebar: SidebarItem[] = [
  { key: "deviceId", title: "Search By Model", path: "", icon: Smartphone },
  { key: "zipCode", title: "Search By Locale", path: "", icon: MapPin },
  {
    key: "preferences",
    title: "Preferences",
    path: "",
    icon: SlidersHorizontal,
  },
];
