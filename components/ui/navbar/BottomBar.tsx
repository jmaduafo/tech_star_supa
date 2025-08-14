"use client"
import React, { useState } from "react";
import IconTextButton from "../buttons/IconTextButton";
import {
  BsColumnsGap,
  BsClipboard2Check,
  BsCashStack,
  BsPeopleFill,
  BsBarChartFill,
} from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BottomBar() {
  const pathname = usePathname()
  const path = pathname.split('/')[1]
  
  const [nav, setNav] = useState(path);

  const navLinks = [
    {
      text: "Dashboard",
      icon: <BsColumnsGap className="w-4 h-4" />,
    },
    {
      text: "Projects",
      icon: <BsClipboard2Check className="w-4 h-4" />,
    },
    {
      text: "Payments",
      icon: <BsCashStack className="w-4 h-4" />,
    },
    {
      text: "Reports",
      icon: <BsBarChartFill className="w-4 h-4" />,
    },
    {
      text: "Team",
      icon: <BsPeopleFill className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="flex justify-center item-center gap-3">
      {navLinks.map((item) => {
        return (
          <Link key={item.text} href={`/${item.text.toLowerCase()}`}>
            <IconTextButton
              textNav={nav}
              setText={setNav}
              text={item.text}
              icon={item.icon}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomBar;
