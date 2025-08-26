"use client";
import React, { useEffect, useState, useRef } from "react";
import { User } from "@/types/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../sheet";
import Header4 from "@/components/fontsize/Header4";
import Header6 from "@/components/fontsize/Header6";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { MapPin, Pencil } from "lucide-react";
import { Skeleton } from "../skeleton";
import { getFullName, getInitials } from "@/utils/initials";
import CustomInput from "../input/CustomInput";
import Input from "../input/Input";
import SelectBar from "../input/SelectBar";
import { country_list, job_titles } from "@/utils/dataTools";
import { SelectItem } from "../select";
import Submit from "../buttons/Submit";
import { toast } from "sonner";
import FilePicker from "../buttons/FilePicker";
import ViewLabel from "../labels/ViewLabel";
import { format } from "timeago.js";
import { createClient } from "@/lib/supabase/client";
import { EditUserSchema } from "@/zod/validation";

type Card = {
  readonly user: User | undefined;
  readonly profileOpen: boolean;
  readonly setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly editProfileOpen: boolean;
  readonly setEditProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly hideEdit?: boolean;
};

function ProfileCard({
  user,
  profileOpen,
  setProfileOpen,
  editProfileOpen,
  setEditProfileOpen,
  hideEdit,
}: Card) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    job_title: "",
  });

  const supabase = createClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevEditOpenRef = useRef<boolean | null>(null);

  // WHEN EDIT PROFILE SHEET CLOSES, IMMEDIATELY OPEN PROFILE CARD
  // AND VICE VERSA
  useEffect(() => {
    // If previous was true and now it's false, then open profile
    if (prevEditOpenRef.current && !editProfileOpen) {
      setProfileOpen(true);
    }

    prevEditOpenRef.current = editProfileOpen ?? null;
  }, [editProfileOpen]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        location: user.location ?? "",
        job_title: user.job_title ?? "",
      });

      setCurrentImage(user.image_url);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      location: form.location.length ? form.location : null,
      job_title: form.job_title.length ? form.job_title : null,
    };

    const result = EditUserSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { first_name, last_name, location, job_title } = result.data;

    try {
      if (!user) {
        return;
      }
      // INITIALIZE WITH THE CURRENT IMAGE IN CASE THE USER MADE NO CHANGES TO THEIR PROFILE PIC
      let imageUrl = currentImage;

      // IF USER HAS CHOSEN A NEW IMAGE, THEN REPLACE PREVIOUS IMAGE WITH THE NEW IMAGE
      if (newImage) {
        // Upload the new image to Supabase storage
        const { data: downloadData, error: downloadError } =
          await supabase.storage
            .from("users")
            .upload(`/avatars/${user.id}/${newImage.name}`, newImage, {
              cacheControl: "3600",
              upsert: true,
            });

        if (downloadError) {
          toast("Something went wrong", {
            description: downloadError.message,
          });

          console.log(downloadError.message);

          return;
        }

        // If there are no errors, retrieve the public URL
        const { data: urlData } = supabase.storage
          .from("users")
          .getPublicUrl(downloadData.path);

        //  Replace the current image with the new image
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("users")
        .update({
          first_name,
          last_name,
          full_name: getFullName(first_name, last_name),
          job_title,
          image_url: imageUrl,
          location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        console.error(error.message);
        return;
      }

      toast("Success!", {
        description: "Your profile was updated successfully",
      });

      setEditProfileOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserLocation = user?.location ? (
    <div className="flex items-end gap-1">
      <MapPin strokeWidth={1} className="w-4 h-4" />
      <Header6 text={user.location} />
    </div>
  ) : null;

  return (
    <>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent
          className="sm:max-w-md"
          aria-describedby="user profile display"
        >
          <DialogHeader>
            <DialogTitle className="capitalize">
              {user ? user.first_name + "'s " : null}
              Profile
            </DialogTitle>
          </DialogHeader>
          <div className="text-darkText/75">
            {/* AVATAR IMAGE */}
            <div className="flex justify-center mt-2">
              {!user ? (
                <div>
                  <Skeleton className="w-[140px] h-[140px] rounded-full" />
                </div>
              ) : (
                <div className="relative">
                  <Avatar className="w-[140px] h-[140px]">
                    <AvatarImage
                      src={user?.image_url ?? ""}
                      alt="user profile url"
                    />
                    <AvatarFallback className="text-5xl">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setEditProfileOpen && setEditProfileOpen(true);
                    }}
                    className={`${
                      hideEdit ? "hidden" : "flex"
                    } absolute transform translate-x-[-50%] translate-y-[-50%] top-[90%] right-0 justify-center items-center w-7 h-7 rounded-full bg-darkText text-lightText hover:bg-dark85`}
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1} />
                  </button>
                </div>
              )}
            </div>
            {/* FULL NAME DISPLAY */}
            <div className="mt-4">
              {!user?.full_name ? (
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-[60%]" />
                </div>
              ) : (
                <Header4
                  text={user?.full_name}
                  className="text-center font-medium"
                />
              )}
            </div>
            {/* LOCATION WITH ROLE */}
            {/* OUTPUT: South Africa | Admin */}
            <div className="mt-2 flex justify-center items-end gap-2">
              <div>
                {!user ? (
                  <div className="">
                    <Skeleton className="h-4 w-[30%]" />
                  </div>
                ) : (
                  checkUserLocation
                )}
              </div>
              {user?.location ? <Header6 text="|" /> : null}
              <div>
                {!user?.role ? (
                  <div className="">
                    <Skeleton className="h-4 w-[30%]" />
                  </div>
                ) : (
                  <div className="">
                    <Header6
                      text={user?.role}
                      className="text-center capitalize"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* USER INFO GRID */}
            {user ? (
              <div className="mt-5 grid grid-cols-2 gap-4">
                {/* FIRST NAME */}
                <ViewLabel
                  label="First name"
                  className="capitalize"
                  content={user.first_name}
                />
                {/* LAST NAME */}
                <ViewLabel
                  label="Last name"
                  className="capitalize"
                  content={user.last_name}
                />
                {/* EMAIL */}
                <ViewLabel label="Email" content={user.email} />
                {/* HIRE TYPE */}
                <ViewLabel
                  label="Hire type"
                  className="capitalize"
                  content={user.hire_type}
                />
                {/* JOB TITLE */}
                <ViewLabel
                  label="Job title"
                  content={user?.job_title ?? "N/A"}
                />
                {/* USER CREATED AT */}
                <ViewLabel label="Joined" content={format(user?.created_at)} />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT SHEET POPUP */}
      <Sheet open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <Avatar className="w-[110px] h-[110px]">
                {imagePreview && (
                  <AvatarImage src={imagePreview} alt="new image preview" />
                )}
                {!imagePreview && currentImage && (
                  <AvatarImage src={currentImage} alt="current image preview" />
                )}
                <AvatarFallback className="text-5xl">
                  {getInitials(user ? user?.full_name : "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-6">
              <FilePicker
                title="Change profile image"
                setNewImage={setNewImage}
                setImagePreview={setImagePreview}
                inputRef={fileInputRef}
              />
            </div>
            <Input
              label="First name"
              htmlFor="first_name"
              className="mt-4"
              type="text"
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
            />
            <Input
              label="Last name"
              htmlFor="last_name"
              className="mt-4"
              type="text"
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
            />
            <CustomInput label="Location" htmlFor="location" className="mt-4">
              <SelectBar
                placeholder={"Select your location"}
                label={"Location"}
                name="location"
                value={form.location}
                valueChange={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    location: text,
                  }))
                }
                className="mt-1 w-full"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem value={item.name} key={item.code}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            <CustomInput label="Job title" htmlFor="job_title" className="mt-4">
              <SelectBar
                placeholder={"Select a job title"}
                label={"Job title"}
                value={form.job_title}
                valueChange={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    job_title: text,
                  }))
                }
                className="mt-1 w-full"
              >
                {job_titles.map((item) => {
                  return (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ProfileCard;
