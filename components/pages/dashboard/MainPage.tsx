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
import { Plus, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { progress } from "@/utils/dashboardProgress";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [open, setOpen] = useState(false);

  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState<number | undefined>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [dropdown] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

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
            "id, name, contractors ( id, name, is_available, country, payments ( id, date, is_paid, is_completed, payment_amounts ( * )) ), contracts ( id, contract_code, date, is_completed, contract_amounts ( * ) ), payments ( *, payment_amounts ( * ) ), stages (id) "
          )
          .eq("team_id", userData.team_id)
          .order("created_at", { ascending: false })
          .throwOnError(),
        supabase
          .from("contract_amounts")
          .select(
            "id, contract_id, name, symbol, code, contracts ( id, team_id, project_id, contractor_id )"
          )
          .eq("contracts.team_id", userData.team_id)
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select(
            "id, payment_id, name, symbol, code, payments ( id, team_id, project_id, contractor_id )"
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
      <div className="flex justify-between items-start mb-1">
        <div>
          {greet.length && userData ? (
            <Header2 text={`Good ${greet}, ${userData?.first_name}`} />
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
          {progressPercent ? (
            <div className="flex items-center gap-3 mt-2">
              <Progress value={progressPercent} className="w-96 " />
              <Paragraph text={`${progressPercent}%`} />
            </div>
          ) : <Skeleton className="h-6 w-[80%]" />}

          <Paragraph
            text={progressMessages.length ? progressMessages[currentIndex] : ""}
            className="italic text-darkText/70"
          />
        </div>
        <div className="flex items-center gap-2">
          {period === "custom" ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="flex gap-1 items-center font-light text-darkText bg-lightText/60 hover:bg-lightText/80 duration-300 px-6 py-2.5 rounded-full">
                  {dateRange?.from && dateRange?.to
                    ? dateRange.from.toLocaleDateString() +
                      " - " +
                      dateRange.to.toLocaleDateString()
                    : "Select date"}
                  <ChevronDownIcon strokeWidth={1} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
              >
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  captionLayout={dropdown}
                  disabled={(date) => date > new Date()}
                  className="rounded-lg border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          ) : null}
          <button className="flex gap-1 items-center font-light bg-darkText text-lightText px-6 py-2.5 rounded-full">
            <span>
              <Plus className="w-5 h-5" strokeWidth={1} />
            </span>
            <span>Add Project</span>
          </button>
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
    </div>
  );
}

export default MainPage;
