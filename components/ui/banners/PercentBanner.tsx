import Paragraph from "@/components/fontsize/Paragraph";
import {
  SolidLine01Icon,
  TradeDownIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

function PercentBanner({
  percent,
  type,
}: {
  readonly percent: string;
  readonly type: string;
}) {
  function percentColor() {
    if (type === "increase") {
      return "text-increase";
    } else if (type === "decrease") {
      return "text-decrease";
    } else if (type === "no change") {
      return "text-lightText";
    }
  }

  function percentIcons() {
    if (type === "increase") {
      return <HugeiconsIcon icon={TradeUpIcon} size={18} />;
    } else if (type === "decrease") {
      return <HugeiconsIcon icon={TradeDownIcon} size={18} />;
    } else if (type === "no change") {
      return <HugeiconsIcon icon={SolidLine01Icon} size={16} />;
    }
  }
  return (
    <div>
      <div className={`${percentColor()} flex items-center gap-0.5`}>
        {percentIcons()}
        <Paragraph text={`${percent}%`} />
      </div>
    </div>
  );
}

export default PercentBanner;
