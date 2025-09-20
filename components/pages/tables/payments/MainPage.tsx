"use client";

import MainTitle from "@/components/ui/labels/MainTitle";
import Loading from "@/components/ui/loading/Loading";
import { paymentColumns } from "@/components/ui/tables/columns";
import DataTable from "@/components/ui/tables/DataTable";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { Payment } from "@/types/types";
import React, { useEffect, useState } from "react";

function MainPage() {
  const [data, setData] = useState<Payment[] | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    if (!userData) {
      return;
    }

    const { data } = await supabase
      .from("payments")
      .select(
        "*, contracts (contract_code, contract_amounts (*)), projects (name), contractors (name), stages ( id, name), payment_amounts (*)"
      )
      .eq("team_id", userData.team_id)
      .order("date", { ascending: false })
      .throwOnError();

    setData(data as Payment[]);
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
      <MainTitle title={"Payment Log"} data={data} />
      <div className="mt-10">
        <DataTable
          columns={paymentColumns}
          data={data}
          is_payment
          advanced
          is_export
          team_name={"My"}
          filterCategory={"currency"}
          showSelections
        />
      </div>
    </section>
  );
}

export default MainPage;
