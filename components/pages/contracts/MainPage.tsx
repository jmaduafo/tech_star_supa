"use client"

import MainTitle from "@/components/ui/labels/MainTitle";
import Loading from "@/components/ui/loading/Loading";
import {
  contractColumns
} from "@/components/ui/tables/columns";
import DataTable from "@/components/ui/tables/DataTable";
import { useAuth } from "@/context/UserContext";
import { Contract } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

function MainPage() {
  const [data, setData] = useState<Contract[] | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    if (!userData) {
      return;
    }

    const { data } = await supabase
      .from("contracts")
      .select(
        "*, projects (name), contractors (name), stages ( id, name ), contract_amounts (*)"
      )
      .eq("team_id", userData.team_id)
      .order("date", { ascending: false })
      .throwOnError();

    setData(data as Contract[]);
  };

  useEffect(() => {
    getData();
  }, [userData]);

  return !data ? (
    <div className="py-16 flex justify-center">
      <Loading className="w-10 h-10" />
    </div>
  ) : (
    <section>
      <MainTitle title={"All Contracts"} data={data} />
      <div className="mt-10">
        <DataTable
          columns={contractColumns}
          data={data}
          is_payment={false}
          advanced
          is_export
          team_name={"My"}
          filterCategory={"description"}
          showSelections
        />
      </div>
    </section>
  );
}

export default MainPage;
