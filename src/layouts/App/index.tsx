import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/utils/tools";
import { useStore } from "@/stores";
import AnimatedBackground from "@/components/core/animated-background";
import { SlidersHorizontal, Smartphone, Menu, ChevronLeft } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { LOCAL_STORAGE } from "@/utils/enums";
import { CountrySelector } from "@/components/share";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/service/api/apple";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import React from "react";
import { Config } from "@/service/types/apple";
import Loading from "@/components/share/loading";
import Search from "./components/search";

const AppLayout = () => {
  const [langTag, setLangTag] = useLocalStorage<string | null>(
    LOCAL_STORAGE.APPLE_LANG_TAG,
    null,
  );
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const isAppRoot = pathname === "/app" || pathname === "/app/";
  const isCollapsed = useStore((state) => state.apple.isCollapsed);
  const setIsCollapsed = useStore((state) => state.apple.setIsCollapsed);
  const setConfig = useStore((state) => state.apple.setConfig);
  const [type, setType] = useState<string>("multiple-models");

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const response = await getConfig();
      setConfig(response.data);
      return response.data;
    },
    enabled: !!langTag,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isAppRoot) {
      navigate({ to: "/app/search" });
    }
  }, [isAppRoot, navigate]);

  if (!langTag) return <CountrySelector setLocalLangTag={setLangTag} />;
  if (isFetching || isLoading) return <Loading />;

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
                onClick={() => setType(item.key)}
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
          <Tooltip>
            <TooltipTrigger>
              <Typography
                className="cursor-pointer"
                variant="inlineCode"
                onClick={() => setLangTag(null)}
              >
                {langTag}
              </Typography>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change Language</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Separator />
        {data && <Form config={data} type={type} />}
      </ResizablePanel>
      {!isAppRoot && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel className="h-full" minSize={25}>
            <Typography variant="h5" className="flex h-[52px] items-center p-4">
              Live console
            </Typography>
            <Separator />
            <Outlet />
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
  icon: LucideIcon;
}

const sidebar: SidebarItem[] = [
  {
    key: "search",
    title: "Search",
    icon: Smartphone,
  },
  {
    key: "preferences",
    title: "Preferences",
    icon: SlidersHorizontal,
  },
];

interface IProps {
  config: Config;
  type: string;
}

const Form: React.FC<IProps> = ({ config, type }) => {
  switch (type) {
    default:
    case "search":
      return <Search config={config} />;
    case "preferences":
      return <div>Preferences Form (Not implemented yet)</div>;
  }
};
