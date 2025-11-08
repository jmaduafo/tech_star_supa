"use client";
import React, { useState, useEffect } from "react";
import { fullDate, fullTime } from "@/utils/dateAndTime";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoonCloudIcon,
  Sun02Icon,
  SunCloud02Icon,
  SunsetIcon,
} from "@hugeicons/core-free-icons";

function TimeDate({
  timeFontSize,
  dateFontSize,
}: {
  readonly timeFontSize?: string;
  readonly dateFontSize?: string;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState({
    hour: "00",
    minutes: "00",
  });

  useEffect(() => {
    function setNow() {
      setDate(fullDate());
      setTime({ hour: fullTime().hour, minutes: fullTime().minutes });
    }

    const intervalId = setInterval(setNow, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function timeIcon(hour: string) {
    if (+hour >= 20 || (+hour >= 0 && +hour < 7)) {
      return (
        <HugeiconsIcon
          icon={MoonCloudIcon}
          strokeWidth={1.5}
          className={
            timeFontSize === "dashboard" ? "w-12 h-12" : "w-[6.5vw] h-[6.5vw]"
          }
        />
      );
    } else if (+hour >= 7 && +hour < 10) {
      return (
        <HugeiconsIcon
          icon={Sun02Icon}
          strokeWidth={1.5}
          className={
            timeFontSize === "dashboard" ? "w-12 h-12" : "w-[6.5vw] h-[6.5vw]"
          }
        />
      );
    } else if (+hour >= 10 && +hour < 18) {
      return (
        <HugeiconsIcon
          icon={SunCloud02Icon}
          strokeWidth={1.5}
          className={
            timeFontSize === "dashboard" ? "w-12 h-12" : "w-[6.5vw] h-[6.5vw]"
          }
        />
      );
    } else {
      return (
        <HugeiconsIcon
          icon={SunsetIcon}
          strokeWidth={1.5}
          className={
            timeFontSize === "dashboard" ? "w-12 h-12" : "w-[6.5vw] h-[6.5vw]"
          }
        />
      );
    }
  }

  return (
    <div>
      <div
        className={`flex justify-center items-center gap-2 tracking-tighter`}
      >
        {/* TIME ICON */}
        <div className="text-darkText duration-200">
          {/* <Clock2
            strokeWidth={1.2}
            className={
              timeFontSize === "dashboard" ? "w-12 h-12" : "w-[6vw] h-[6vw]"
            }
          /> */}
          {timeIcon(time.hour)}
        </div>
        {/* TIME DISPLAY */}
        <p
          className={`text-center leading-[1] font-medium ${
            timeFontSize === "dashboard" ? "text-[4vw]" : "text-[7vw]"
          }`}
        >
          {time.hour}
          <span className={`animate-pulse mx-1`}>:</span>
          {time.minutes}
        </p>
      </div>
      <p
        className={`text-center font-medium tracking-tight ${
          dateFontSize === "dashboard" ? "text-[18px]" : "text-[2.3vw]"
        }`}
      >
        {date}
      </p>
    </div>
  );
}

export default TimeDate;
