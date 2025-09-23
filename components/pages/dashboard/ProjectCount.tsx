"use client";
import React, { useState, useEffect } from "react";
import { Amount, Project, User } from "@/types/types";
import CountCard from "@/components/ui/cards/CountCard";

function ProjectCount({
  projects,
  currencies,
  user,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly user: User | undefined;
}) {
  const [count, setCount] = useState<number | undefined>();

  const getData = async () => {
    try {
      if (!user || !projects) {
        return;
      }

      setCount(projects.length);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, [user, projects]);

  return <CountCard count={count} showLink title="Total project" />;
}

export default ProjectCount;
