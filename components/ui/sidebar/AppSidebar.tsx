"use client";

import React, { useState } from "react";
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
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
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
  ContractsIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import ProfileCard from "../cards/ProfileCard";
import { useAuth } from "@/context/UserContext";
import { useUsers } from "@/lib/queries/queries";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { getInitials } from "@/utils/initials";
import Paragraph from "@/components/fontsize/Paragraph";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../../public/images/logo.png";
import Image from "next/image";
import Header6 from "@/components/fontsize/Header6";

function AppSidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const { setOpen } = useSidebar();
  const path = usePathname();

  const { userData } = useAuth();
  const { data: user } = useUsers(userData?.id);
  const route = useRouter();

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
      icon: <HugeiconsIcon icon={TableIcon} size={16} strokeWidth={1} />,
      dropdown: [
        {
          title: "Payments",
          url: "/tables/payments",
          icon: <HugeiconsIcon icon={Money01Icon} size={16} strokeWidth={1} />,
        },
        {
          title: "Contracts",
          url: "/tables/contracts",
          icon: (
            <HugeiconsIcon icon={ContractsIcon} size={16} strokeWidth={1} />
          ),
        },
        {
          title: "Contractors",
          url: "/tables/contractors",
          icon: (
            <HugeiconsIcon icon={UserSquareIcon} size={16} strokeWidth={1} />
          ),
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

  return (
    <Sidebar>
      <SidebarHeader>
        <button
          onClick={() => { 
            path !== "/dashboard" && route.push("/dashboard");
            setOpen(false)
          }}
          className="flex gap-2 items-center py-2 hover:bg-lightText px-2 duration-300 rounded-md"
        >
          <span className="w-6 h-6 object-cover object-center">
            <Image src={Logo} alt="logo design" className="w-full h-full" />
          </span>
          <Header6 text="TechStar" className="font-medium" />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.dropdown ? (
                  <Collapsible
                    key={item.title}
                    className="group/collapsible"
                    onClick={() => setCollapseOpen((prev) => !prev)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <span className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                              {item.icon}
                              {item.title}
                            </span>
                            {collapseOpen ? (
                              <ChevronUp size={16} strokeWidth={1} />
                            ) : (
                              <ChevronDown size={16} strokeWidth={1} />
                            )}
                          </span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            {item.dropdown.map((drop) => (
                              <SidebarMenuButton
                                asChild
                                onClick={() => setOpen(false)}
                                className={`${
                                  path.includes(drop.url)
                                    ? "bg-lightText"
                                    : "bg-transparent"
                                } hover:bg-lightText duration-300`}
                                key={drop.title}
                              >
                                <Link href={drop.url}>
                                  <span>{drop.icon}</span>
                                  <span>{drop.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            ))}
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => setOpen(false)}
                      className={`${
                        path.includes(item.url)
                          ? "bg-lightText"
                          : "bg-transparent"
                      } hover:bg-lightText duration-300`}
                    >
                      <Link href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <SidebarMenuItem
            className={`hover:bg-lightText bg-lightText/60 rounded-md duration-300 py-2 px-1`}
          >
            <SidebarMenuButton
              onClick={() => {
                setProfileOpen(true);
                setEditProfileOpen(false);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2.5">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user.image_url ?? ""}
                    alt={user.first_name + " profile"}
                  />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <Paragraph text={user.full_name} />
                  <Paragraph text="Free" className="text-darkText/60 -mt-1" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuSkeleton className="h-6 w-full" />
        )}
        <ProfileCard
          user={user}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          editProfileOpen={editProfileOpen}
          setEditProfileOpen={setEditProfileOpen}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
