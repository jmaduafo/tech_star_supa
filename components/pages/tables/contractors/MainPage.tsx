"use client";

import { useAuth } from "@/context/UserContext";
import { Contractor } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/ui/loading/Loading";
import MainTitle from "@/components/ui/labels/MainTitle";
import DataTable from "@/components/ui/tables/DataTable";
import { contractorColumns } from "@/components/ui/tables/columns";

function MainPage() {
  const [data, setData] = useState<Contractor[] | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    if (!userData) {
      return;
    }

    const { data } = await supabase
      .from("contractors")
      .select(
        "*, projects ( name ), payments (id, is_paid, payment_amounts (*)), contracts (id, contract_amounts (*)), stage_contractors (*, stages ( id, name ))"
      )
      .eq("team_id", userData.team_id)
      .order("relevance", { ascending: false })
      .throwOnError();

    setData(data as Contractor[]);
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
      <MainTitle title={"Contractor Log"} data={data} />
      <div className="mt-10">
        <DataTable
          columns={contractorColumns}
          data={data}
          is_payment={false}
          advanced
          is_export
          team_name={"My"}
          filterCategory={"name"}
        />
      </div>
    </section>
  );
}

export default MainPage;
