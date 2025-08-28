"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { User } from "@/types/types";
import ProfileCard from "../cards/ProfileCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/UserContext";

function TopBar() {
  const [user, setUser] = useState<User | undefined>();

  const { userData } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const getUser = async () => {
    try {
      if (!userData) {
        return;
      }

      const { data } = await supabase
        .from("users")
        .select()
        .eq("id", userData.id)
        .single()
        .throwOnError();

      setUser(data as User);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, [userData]);

  // CHECKS FOR CHANGES IN USER PROFILE
  useEffect(() => {
    if (user) {
      const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          getUser()}
      )
      .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, userData, user, setUser]);

  return (
    <div className="flex justify-between items-center">
      <div>
        <p>LOGO</p>
      </div>
      <div className="flex gap-3">
        <ProfileButton user={user} />
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

function SettingButton({ user }: { readonly user: User | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
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
          <ProfileSettings user={user} />
          <AppearanceSettings user={user} />
          <SecuritySettings user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
