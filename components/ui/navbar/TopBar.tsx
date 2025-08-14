"use client";
import React, { useEffect, useState } from "react";
import { HiUser, HiMiniCog8Tooth } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useAuth } from "@/context/AuthContext";
// import AppearanceSettings from "./settings/appearance/AppearanceSettings";
// import ProfileSettings from "./settings/profile/ProfileSettings";
// import SecuritySettings from "./settings/security/SecuritySettings";
import { User } from "@/types/types";
import ProfileCard from "../cards/ProfileCard";

function TopBar() {
  // const { userData } = useAuth();

  // const [userInfo, setUserInfo] = useState<User | undefined>();

  // const getData = () => {
  //   try {
  //     if (!userData) {
  //       return;
  //     }

  //     const userq = doc(db, "users", userData?.id);

  //     const unsub = onSnapshot(userq, (snap) => {
  //       if (snap?.exists()) {
  //         setUserInfo({ ...(snap.data() as User), id: snap?.id });
  //       }

  //       return () => unsub();
  //     });
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, [userData?.id ?? "guest"]);

  return (
    <div className="flex justify-between items-center">
      <div>
        <p>LOGO</p>
      </div>
      {/* <div className="flex gap-3">
        <ProfileButton user={userInfo} />
        <SettingButton user={userInfo} />
      </div> */}
    </div>
  );
}

export default TopBar;

// function ProfileButton({ user }: { readonly user: User | undefined }) {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [editProfileOpen, setEditProfileOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setProfileOpen(true)}
//         className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
//         title="Profile"
//       >
//         <HiUser className="w-4 h-4" />
//       </button>
//       <ProfileCard
//         user={user}
//         setProfileOpen={setProfileOpen}
//         profileOpen={profileOpen}
//         editProfileOpen={editProfileOpen}
//         setEditProfileOpen={setEditProfileOpen}
//       />
//     </>
//   );
// }

// function SettingButton({ user }: { readonly user: User | undefined }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <button
//           className="bg-darkText rounded-full p-2 hover:opacity-70 duration-300"
//           title="Setting"
//         >
//           <HiMiniCog8Tooth className="w-4 h-4" />
//         </button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Settings</DialogTitle>
//           <DialogDescription>
//             Modify and customize to fit your needs
//           </DialogDescription>
//         </DialogHeader>
//         <div className="w-full">
//           <ProfileSettings user={user} />
//           <AppearanceSettings user={user} />
//           <SecuritySettings user={user} />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
