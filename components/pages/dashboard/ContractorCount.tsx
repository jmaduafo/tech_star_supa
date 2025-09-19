"use client";
import React, { useState, useEffect } from "react";
import { Amount, Project, User } from "@/types/types";
import CountCard from "@/components/ui/cards/CountCard";

function ContractorCount({
  projects,
  currencies,
  user
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

      const contractors = []

      projects.forEach(project => {
        project.contractors?.forEach(contractor => {
          contractors.push(contractor)
        })
      })

      setCount(contractors.length)
    } catch (err: any) {
      console.error(err.message)
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  return <CountCard count={count} title="Total contractor"/>;
}

export default ContractorCount;
