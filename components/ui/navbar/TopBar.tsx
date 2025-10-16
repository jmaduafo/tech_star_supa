"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AppearanceSettings from "./settings/appearance/AppearanceSettings";
import ProfileSettings from "./settings/profile/ProfileSettings";
import SecuritySettings from "./settings/security/SecuritySettings";
import { Contractor, Project, User } from "@/types/types";
import ProfileCard from "../cards/ProfileCard";
import { useAuth } from "@/context/UserContext";
import { useSearch, useUsers } from "@/lib/queries/queries";
import { SidebarTrigger } from "../sidebar";
import { Search } from "lucide-react";
import NotAvailable from "../NotAvailable";
import Paragraph from "@/components/fontsize/Paragraph";
import Link from "next/link";

function TopBar() {
  const { userData } = useAuth();
  const [isMenu, setIsMenu] = useState(false);

  const { data: user } = useUsers(userData?.id);

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
        />
        <p className={`${isMenu ? "visible" : "invisible"}`}>Menu</p>
      </div>
      <div className="w-1/2 relative">
        <SearchBar user={user} />
      </div>

      <div className="flex gap-3">
        {/* <ProfileButton user={user} /> */}
        <SettingButton user={user} />
      </div>
    </div>
  );
}

export default TopBar;

function ProfileButton({ user }: { readonly user: User | undefined }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setProfileOpen(true)}
        className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
        title="Profile"
      >
        <HiUser className="w-4 h-4" />
      </button>
      <ProfileCard
        user={user}
        setProfileOpen={setProfileOpen}
        profileOpen={profileOpen}
        editProfileOpen={editProfileOpen}
        setEditProfileOpen={setEditProfileOpen}
      />
    </>
  );
}

function SearchBar({ user }: { readonly user: User | undefined }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const [value, setValue] = useState("");

  const [filteredProject, setFilteredProject] = useState<Project[]>([]);
  const [filteredContractor, setFilteredContractor] = useState<Contractor[]>(
    []
  );

  const searchRef = useRef<HTMLDivElement>(null);
  const { data } = useSearch(user?.team_id);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);

    if (e.target.value.length) {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }

    if (!data) {
      return;
    }

    setFilteredProject(
      data.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      ) as Project[]
    );

    const contractors: Contractor[] = [];

    data.forEach((item) => {
      item.contractors?.forEach((contractor) => {
        contractors.push(contractor as Contractor);
      });
    });

    setFilteredContractor(
      contractors.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  return (
    <>
      <div
        className={`flex justify-between items-center gap-3 bg-lightText/50 px-1.5 py-1 rounded-xl
        }`}
      >
        <div className="flex items-center gap-1 flex-1">
          <Search className="w-5 text-darkText" />
          <input
            value={value}
            onChange={handleChange}
            type="text"
            placeholder="Search"
            className="placeholder-darkText/70 text-sm py-0"
          />
        </div>
      </div>
      <div
        ref={searchRef}
        className={`${
          searchOpen ? "block" : "hidden"
        } z-50 w-full mt-3 px-2 py-1 absolute bg-lightText/40 border border-dark10 backdrop-blur-xl rounded-md`}
      >
        {!filteredProject.length && !filteredContractor.length ? (
          <div className="w-full pb-4">
            <NotAvailable text="No data available" />
          </div>
        ) : null}
        {filteredProject.length ? (
          <div>
            <Paragraph text="Projects" className="font-medium mt-1.5" />
            <div className="flex flex-col">
              {filteredProject.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <Link
                      href={`/projects/${item.id}/contractors`}
                      onClick={() => { setValue(item.name); setSearchOpen(false) }}
                    >
                      <Paragraph
                        text={item.name}
                        className="cursor-pointer py-1 px-2 hover:bg-lightText/80 rounded-md"
                      />
                    </Link>
                  </Fragment>
                );
              })}
            </div>
          </div>
        ) : null}
        {filteredContractor.length ? (
          <div>
            <Paragraph text="Contractors" className="font-medium mt-1.5" />
            <div className="flex flex-col">
              {filteredContractor.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <Link
                      href={`/projects/${item.project_id}/contractors/${item.id}/contracts`}
                      onClick={() => { setValue(item.name); setSearchOpen(false) }}
                    >
                      <Paragraph
                        text={item.name}
                        className="cursor-pointer py-1 px-2 hover:bg-lightText/80 rounded-md"
                      />
                    </Link>
                  </Fragment>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function SettingButton({ user }: { readonly user: User | undefined }) {
  const [mainOpen, setMainOpen] = useState(false);

  return (
    <Dialog open={mainOpen} onOpenChange={setMainOpen}>
      <DialogTrigger asChild>
        <button
          className="text-darkText bg-lightText/70 rounded-full p-2 hover:bg-lightText duration-300"
          title="Setting"
        >
          <HiMiniCog8Tooth className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Modify and customize to fit your needs
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <ProfileSettings
            user={user}
            open={mainOpen}
            openChange={setMainOpen}
          />
          <AppearanceSettings user={user} />
          <SecuritySettings user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
