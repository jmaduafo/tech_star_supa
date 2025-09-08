import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  Task01Icon,
  TableIcon,
  Money01Icon,
  AnalysisTextLinkIcon,
  UserGroup03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

function AppSidebar() {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={DashboardSquare02Icon} size={24} strokeWidth={1} />
      ),
      dropdown: null,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1} />,
      dropdown: null,
    },
    {
      title: "Tables",
      url: "",
      icon: <HugeiconsIcon icon={TableIcon} size={24} strokeWidth={1} />,
      dropdown: [
        {
          title: "Payments",
          url: "/tables/payments",
          icon: <HugeiconsIcon icon={TableIcon} size={24} strokeWidth={1} />,
        },
        {
          title: "Contracts",
          url: "/tables/contracts",
          icon: <HugeiconsIcon icon={TableIcon} size={24} strokeWidth={1} />,
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: (
        <HugeiconsIcon icon={AnalysisTextLinkIcon} size={24} strokeWidth={1} />
      ),
      dropdown: null,
    },
    {
      title: "Team",
      url: "/team",
      icon: <HugeiconsIcon icon={UserGroup03Icon} size={24} strokeWidth={1} />,
      dropdown: null,
    },
  ];

  const { setOpen } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <p>LOGO</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setOpen(false)}
                    className={`hover:bg-lightText duration-300`}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
