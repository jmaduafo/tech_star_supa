import React from "react";
import { HiChevronRight } from "react-icons/hi2";
import Loading from "../Loading";

function Submit({
  loading,
  buttonClick,
  width_height,
  arrow_width_height,
  width,
  disabledLogic
}: {
  readonly disabledLogic?: boolean;
  readonly loading: boolean;
  readonly width_height?: string;
  readonly arrow_width_height?: string;
  readonly width?: string;
  readonly buttonClick?: () => void;
}) {

  return (
    <button
      type="submit"
      onClick={buttonClick}
      aria-label="submit button"
      className={`rounded-full bg-dark35 group ${width_height ?? "w-[160px] h-[60px]"} ${disabledLogic ? "opacity-60" : "opacity-100"}`}
      disabled={!!(loading || disabledLogic)}
    >
      <span
        className={`${
          loading ? "w-full" : width ?? "w-[60px]"
        } duration-300 rounded-full flex justify-end items-center h-full bg-darkText px-1 group-hover:bg-dark75`}
      >
        {loading ? (
          <Loading className="mr-2 w-6 h-6" />
        ) : (
          <HiChevronRight className={`${arrow_width_height ?? "w-10 h-10"}`} />
        )}
      </span>
    </button>
  );
}

export default Submit;
