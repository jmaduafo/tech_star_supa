"use client";
import Header5 from "@/components/fontsize/Header5";
import Paragraph from "@/components/fontsize/Paragraph";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { Activity, Amount, Project, User } from "@/types/types";
import { getInitials } from "@/utils/initials";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "timeago.js";
import ViewLabel from "@/components/ui/labels/ViewLabel";

function Activities({
  projects,
  currencies,
  user,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly user: User | undefined;
}) {
  const [singleActivityOpen, setsingleActivityOpen] = useState(false);

  const [data, setData] = useState<Activity[] | undefined>();
  const [singleData, setSingleData] = useState<Activity | undefined>();

  const supabase = createClient();

  const getAcivities = async () => {
    try {
      if (!user) {
        return;
      }

      const { data } = await supabase
        .from("activities")
        .select("*, users ( id, first_name, image_url, full_name )")
        .eq("team_id", user.team_id)
        .order("created_at", { ascending: false })
        .throwOnError();
      setData(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAcivities();
  }, [user]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-20 xl:mb-0">
        <Header5 text="Recent Activities" />
      </div>
      <div className="mt-auto">
        {data ? (
          data.slice(0, 5).map((item, i) => {
            return (
              <button
                onClick={() => {
                  setSingleData(item);
                  setsingleActivityOpen(true);
                }}
                key={`item_${i + 1}`}
                className={`py-2.5 px-1.5 ${
                  i + 1 !== 5 ? "border-b" : ""
                } border-b-lightText/10 flex justify-between items-center gap-4 w-full hover:bg-lightText/10 duration-300`}
              >
                <div className="flex-1 hidden sm:block">
                  <Paragraph
                    text={format(item.created_at)
                      .replace("minute", "min")
                      .replace("second", "sec")
                      .replace("hour", "hr")}
                    className="text-left"
                  />
                </div>
                <div className="flex-1 hidden md:block lg:block xl:hidden 2xl:block">
                  <Paragraph
                    text={item.activity_type ?? ""}
                    className="capitalize text-left"
                  />
                </div>
                <div className="flex-[4] flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={item.users?.image_url ?? ""}
                      alt={user ? `${item.users?.first_name}_profile` : ""}
                    />
                    <AvatarFallback>
                      {user ? getInitials(item.users?.full_name) : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-start gap-1">
                    <Paragraph
                      text={`${item.users?.first_name},`}
                      className="font-medium"
                    />
                    <Paragraph
                      text={`${
                        item.description && item.description?.length > 40
                          ? item.description?.slice(0, 40) + "..."
                          : item.description
                      }`}
                      className="font-light text-left"
                    />
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}
      </div>
      {singleData ? (
        <SingleActivity
          open={singleActivityOpen}
          setOpen={setsingleActivityOpen}
          data={singleData}
        />
      ) : null}
    </div>
  );
}

export default Activities;

const SingleActivity = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Activity | undefined;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="single activity log"
      >
        <DialogHeader>
          <DialogTitle>Activity log</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data ? (
            <>
              <ViewLabel label={"Created by"} content={data.users?.full_name} />
              <ViewLabel
                label={"Activity Type"}
                content={data.activity_type}
                className="capitalize"
              />
              <ViewLabel label={"Description"} content={data.description} />
              <ViewLabel
                label={"Created at"}
                content={format(data.created_at)}
              />
            </>
          ) : (
            <>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AllActivities = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Activity[] | undefined;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="single activity log"
      >
        <DialogHeader>
          <DialogTitle>Activity log</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4"></div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
