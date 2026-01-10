"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";
import LineChartDisplay from "./LineChartDisplay";
import Card from "@/components/ui/cards/MyCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/UserContext";
import { Project, Amount, User, Activity } from "@/types/types";
import { getUniqueObjects } from "@/utils/chartHelpers";
import { greeting } from "@/utils/greeting";
import Header2 from "@/components/fontsize/Header2";
import { Progress } from "@/components/ui/progress";
import Paragraph from "@/components/fontsize/Paragraph";
import Activities from "./Activities";
import ContractorMap from "./ContractorMap";
import { Plus } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { progress } from "@/utils/dashboardProgress";
import { Skeleton } from "@/components/ui/skeleton";
import ContractorsDisplay from "./ContractorsDisplay";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import CustomDate from "@/components/ui/buttons/CustomDate";
import { useRouter } from "next/navigation";

function MainPage() {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [allActivities, setAllActivities] = useState<Activity[] | undefined>();
  const [team, setTeam] = useState<User[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [period, setPeriod] = useState("year");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [greet, setGreet] = useState("");

  const supabase = useMemo(() => createClient(), []);
  const { userData } = useAuth();

  const [user, setUser] = useState<User | undefined>();

  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState<number | undefined>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const route = useRouter();

  const today = new Date();
  today.setDate(today.getDate() - 1);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: new Date(),
  });

  // GET USER INFO IN REALTIME
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
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${userData.id}`,
        },
        (payload) => getUser()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, setUser]);

  // GREETING FOR USER
  useEffect(() => {
    const userGreet = setInterval(() => {
      setGreet(greeting());
    }, 1000);

    return () => clearInterval(userGreet);
  }, []);

  const getData = async () => {
    try {
      if (!userData) {
        return;
      }

      const [
        projects,
        contractCurrencies,
        paymentCurrencies,
        activities,
        team,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select(
            "id, name, contractors ( *, projects ( name ), payments ( id, date, is_paid, is_completed, payment_amounts ( * )), contracts (id, contract_amounts (*)), stage_contractors (*, stages ( id, name ))), contracts ( id, contract_code, date, is_completed, contract_amounts ( * ) ), payments ( *, projects (name), contractors (name), stages (name), contracts (contract_code), payment_amounts ( * ) ), stages (id) "
          )
          .eq("team_id", userData.team_id)
          .order("created_at", { ascending: false })
          .throwOnError(),
        supabase
          .from("contract_amounts")
          .select(
            "id, contract_id, name, symbol, code, contracts!inner( id, team_id, project_id, contractor_id )"
          )
          .eq("contracts.team_id", userData.team_id)
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select(
            "id, payment_id, name, symbol, code, payments!inner( id, team_id, project_id, contractor_id )"
          )
          .eq("payments.team_id", userData.team_id)
          .throwOnError(),
        supabase
          .from("activities")
          .select()
          .eq("team_id", userData.team_id)
          .throwOnError(),
        supabase
          .from("users")
          .select("id")
          .eq("team_id", userData.team_id)
          .throwOnError(),
      ]);

      setAllProjects(projects.data as unknown as Project[]);
      setAllActivities(activities.data as Activity[]);
      setTeam(team.data as User[]);
      setSelectedProject(projects.data[0].id);

      setCurrenciesList(
         getUniqueObjects(
              [...contractCurrencies.data, ...paymentCurrencies.data],
              "code"
            )
      );

      setSelectedCurrency(
          getUniqueObjects(
              [...contractCurrencies.data, ...paymentCurrencies.data],
              "code"
            )[0].code
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getUser();
    getData();
  }, [userData]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setCustomStart(dateRange.from.toLocaleDateString());
      setCustomEnd(dateRange.to.toLocaleDateString());
    }
  }, [dateRange]);

  useEffect(() => {
    if (progressMessages.length) {
      const slideInterval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % progressMessages.length
        );
      }, 5000); // Change slide every 3 seconds

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(slideInterval);
    }
  }, [progressMessages]);

  useEffect(() => {
    if (allProjects && allActivities && team) {
      const progressResult = progress(allProjects, team, allActivities);

      setProgressMessages(
        progressResult?.messages
          ? [
              ...progressResult.messages,
              `You are ${progressResult.percentage}% closer to a fully populated dashboard`,
            ]
          : []
      );

      progressResult && setProgressPercent(progressResult.percentage);
    }
  }, [allProjects, allActivities, team]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col-reverse gap-5 lg:flex-row justify-between items-start mb-1">
        <div className="w-full">
          {greet.length && userData ? (
            <Header2 text={`Good ${greet}, ${userData?.first_name}`} />
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
          {typeof progressPercent === "number" ? (
            <div className="flex items-center gap-3 mt-2">
              <Progress value={progressPercent} className="flex-1 lg:flex-initial lg:w-96" />
              <Paragraph text={`${progressPercent}%`} />
            </div>
          ) : (
            <Skeleton className="h-6 w-[80%]" />
          )}

          <Paragraph
            text={progressMessages.length ? progressMessages[currentIndex] : ""}
            className="italic text-darkText/70"
          />
        </div>
        <div className="w-full lg:w-auto flex justify-end lg:justify-start items-center gap-2">
          {period === "custom" ? (
            <CustomDate dateRange={dateRange} setDateRange={setDateRange} />
          ) : null}
          <PrimaryButton action={() => route.push("/projects")}>
            <>
              <span>
                <Plus className="w-5 h-5" strokeWidth={1} />
              </span>
              <span>Add Project</span>
            </>
          </PrimaryButton>
        </div>
      </div>
      <DashboardGrid
        user={user}
        projects={allProjects}
        selectedProject={selectedProject}
        selectedCurrency={selectedCurrency}
        period={period}
        customStart={customStart}
        customEnd={customEnd}
        setPeriod={setPeriod}
        setSelectedProject={setSelectedProject}
        setSelectedCurrency={setSelectedCurrency}
        setCustomStart={setCustomStart}
        setCustomEnd={setCustomEnd}
        currencies={currenciesList}
      />
      <div className="grid xl:grid-cols-7 gap-3">
        <Card className="xl:col-span-4">
          <ContractorMap
            projects={allProjects}
            selectedProject={selectedProject}
          />
        </Card>
        <Card className="xl:col-span-3">
          <Activities user={user} />
        </Card>
      </div>
      <Card className="">
        <LineChartDisplay
          projects={allProjects}
          currencies={currenciesList}
          selectedProject={selectedProject}
          selectedCurrency={selectedCurrency}
          customStart={customStart}
          customEnd={customEnd}
          period={period}
        />
      </Card>
      <div className="mt-2">
        <PaymentDisplay
          projects={allProjects}
          currencies={currenciesList}
          selectedProject={selectedProject}
        />
      </div>
      <div className="mt-2">
        <ContractorsDisplay
          projects={allProjects}
          selectedProject={selectedProject}
        />
      </div>
    </div>
  );
}

export default MainPage;
