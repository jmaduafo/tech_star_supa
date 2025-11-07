import { Activity, Project, User } from "@/types/types";
import { optionalS } from "./optionalS";
import { versusLast } from "./dateAndTime";

export const progress = (
  projects: Project[],
  team: User[],
  activities: Activity[]
) => {
  const progress: any[] = [];
  const finalProgress: any[] = [];

  const contractors: boolean[] = [];
  const stages: boolean[] = [];
  const contracts: boolean[] = [];
  const payments: boolean[] = [];
  const activity: boolean[] = [];

  let tasksLeft = 0;

  // MUST HAVE AT LEAST 3 PROJECTS INSERTED
  if (projects.length >= 3) {
    progress.push({
      message: null,
      success: true,
    });
  } else {
    progress.push({
      message: `Getting there — Insert ${2 - projects.length} more project${optionalS(
        2 - projects.length
      )}`,
      success: false,
    });
  }

  // EACH PROJECT MUST HAVE AT LEAST 2 CONTRACTORS INSERTED
  for (const project of projects) {
    if (project.contractors) {
      if (project.contractors.length >= 2) {
        contractors.push(true);
      } else {
        contractors.push(false);
      }
    }
  }

  if (contractors.some((item) => !item)) {
    progress.push({
      message: `Keep it up! Add at least 2 contractors to each project`,
      success: false,
    });
  } else {
    progress.push({
      message: null,
      success: true,
    });
  }

  // EACH CONTRACTOR MUST HAVE AT LEAST 10 PAYMENTS
  for (const project of projects) {
    if (!project.contractors) {
      return;
    }

    project.contractors.forEach((contractor) => {
      if (contractor.payments?.length >= 10) {
        payments.push(true);
      } else {
        payments.push(false);
      }
    });
  }

  if (payments.some((item) => !item)) {
    progress.push({
      message: `Almost there — Add ten payments in total for each contractor`,
      success: false,
    });
  } else {
    progress.push({
      message: null,
      success: true,
    });
  }

  // EACH CONTRACTOR MUST HAVE AT LEAST 2 CONTRACTS
  for (const project of projects) {
    if (!project.contractors) {
      return;
    }

    project.contractors.forEach((contractor) => {
      if (contractor.contracts?.length >= 1) {
        contracts.push(true);
      } else {
        contracts.push(false);
      }
    });
  }

  if (contracts.some((item) => !item)) {
    progress.push({
      message: `Making progress — Not every contractor has at least one contract`,
      success: false,
    });
  } else {
    progress.push({
      message: null,
      success: true,
    });
  }

  // EACH PROJECT MUST HAVE AT LEAST THREE STAGES
  for (const project of projects) {
    if (project.stages) {
      if (project.stages.length >= 2) {
        stages.push(true);
      } else {
        stages.push(false);
      }
    }
  }

  if (stages.some((item) => !item)) {
    progress.push({
      message: `You are close! Add at least 2 stages to each project`,
      success: false,
    });
  } else {
    progress.push({
      message: null,
      success: true,
    });
  }

  // MUST ADD 1 MORE TEAM MEMBER
  if (team.length >= 3) {
    progress.push({
      message: null,
      success: true,
    });
  } else {
    progress.push({
      message: `Teamwork makes the dream work! ${
        2 - team.length
      } more member${optionalS(2 - team.length)} for a full team`,
      success: false,
    });
  }

  // MUST INSERT A PAYMENT EACH WEEK
  for (const item of activities) {
    if (item.activity_type?.toLowerCase() === "payment") {
      versusLast(item.created_at, "week").current
        ? activity.push(true)
        : activity.push(false);
    }
  }

  if (activity.some((item) => !item)) {
    progress.push({
      message: `Add at least one payment for the week. Let's go!`,
      success: false,
    });
  } else {
    progress.push({
      message: null,
      success: true,
    });
  }

  // CALCULATE PROGRESS PERCENTAGE
  progress.forEach((item) => {
    if (!item.success) {
      tasksLeft++;
      finalProgress.push(item.message);
    }
  });

  return {
    percentage: Math.round(((progress.length - tasksLeft) / progress.length) * 100),
    messages: finalProgress,
  };
};
