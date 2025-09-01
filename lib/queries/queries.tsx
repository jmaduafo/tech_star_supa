"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useUsers({
  user_id,
}: {
  readonly user_id: string | undefined;
}) {
  return useQuery({
    queryKey: ["users", user_id],
    queryFn: async () => {
      try {
        if (!user_id) return;

        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user_id)
          .throwOnError();

        return data;
      } catch (err: any) {
        console.log(err.message);
      }
    },
    refetchInterval: 5_000,
    enabled: !!user_id,
  });
}

export function useBackgroundImage(user_id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["users", user_id],
    queryFn: async () => {
      if (!user_id) return null;

      const { data, error } = await supabase
        .from("users")
        .select("bg_image_index")
        .eq("id", user_id)
        .single();

      if (error) {
        console.log(error.message);
        return null;
      }

      return data.bg_image_index;
    },
    // fallback polling, but less frequent (every 1 min for example)
    refetchOnWindowFocus: true,
    refetchInterval: undefined,
    enabled: !!user_id,
  });

  // Setup realtime subscription
  useEffect(() => {
    if (!user_id) return;

    const channel = supabase
      .channel("user-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user_id}`,
        },
        () => {
          query.refetch();
          // Invalidate cached query when a change happens
          queryClient.invalidateQueries({ queryKey: ["users", user_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user_id, queryClient]);

  return query;
}

export function useTeamData(team_id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["teams", team_id],
    queryFn: async () => {
      if (!team_id) return null;

      const [users, teams] = await Promise.all([
        supabase
          .from("users")
          .select("*")
          .eq("team_id", team_id)
          .order("created_at", { ascending: true })
          .throwOnError(),
        supabase
          .from("teams")
          .select("team_name")
          .eq("id", team_id)
          .single()
          .throwOnError(),
      ]);

      return {
        team_data: users.data,
        team_name: teams.data.team_name,
      };
    },
    // fallback polling, but less frequent (every 1 min for example)
    refetchOnWindowFocus: true,
    refetchInterval: undefined,
    enabled: !!team_id,
  });

  // Setup realtime subscription
  useEffect(() => {
    if (!team_id) return;

    const channel = supabase
      .channel("team-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `id=eq.${team_id}`,
        },
        () => {
          query.refetch();
          // Invalidate cached query when a change happens
          queryClient.invalidateQueries({ queryKey: ["teams", team_id] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
        },
        () => {
          query.refetch();
          // Invalidate cached query when a change happens
          queryClient.invalidateQueries({ queryKey: ["teams", team_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [team_id, queryClient]);

  return query;
}

export function usePaymentTotals(filters: {
  projectIds?: string[];
  contractorIds?: string[];
}) {
  return useQuery({
    queryKey: ["payment-totals", filters],
    queryFn: async () => {
      let query = supabase
        .from("payments")
        .select("amount, currency, contract_id, contractor_id, project_id");

      if (filters.projectIds?.length)
        query = query.in("project_id", filters.projectIds);
      if (filters.contractorIds?.length)
        query = query.in("contractor_id", filters.contractorIds);

      const { data, error } = await query;
      if (error) throw error;

      // aggregate totals
      const totals: Record<
        string,
        { inContract: number; outContract: number; total: number }
      > = {};
      data.forEach((p) => {
        if (!totals[p.currency]) {
          totals[p.currency] = { inContract: 0, outContract: 0, total: 0 };
        }
        if (p.contract_id) {
          totals[p.currency].inContract += p.amount;
        } else {
          totals[p.currency].outContract += p.amount;
        }
        totals[p.currency].total += p.amount;
      });

      return totals;
    },
    refetchInterval: 25_000,
  });
}
