import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import Paragraph from "@/components/fontsize/Paragraph";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Hover = {
  readonly mode: string;
  readonly requirements: {
    schema: string;
    description: string;
    type: string;
    validation: string;
  }[];
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly open: boolean;
};
function BulkAddHoverCard({ mode, requirements, setOpen, open }: Hover) {
  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Button variant="link" className="" size={"sm"}>
          <HelpCircle className="" strokeWidth={1.5} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto" align="start">
        <Paragraph text="Table must include:" className="text-darkText/80" />
        <div className="grid gap-8 mt-1 [grid-template-columns:auto_auto_auto_auto]">
          <div className="">
            <Paragraph text="Headers" className="underline" />
            <div>
              {mode.toLowerCase() === "contractor"
                ? requirements.map((item) => {
                    return (
                      <div key={item.schema} className="">
                        <Paragraph text={`${item.schema}`} />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div>
            <Paragraph text="Type" className="underline" />
            <div>
              {mode.toLowerCase() === "contractor"
                ? requirements.map((item) => {
                    return (
                      <div key={item.schema} className="">
                        <Paragraph
                          text={`${item.type}`}
                          className="text-darkText/80 italic"
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div>
            <Paragraph text="Description" className="underline" />
            <div>
              {mode.toLowerCase() === "contractor"
                ? requirements.map((item) => {
                    return (
                      <div key={item.schema} className="">
                        <Paragraph
                          text={`${item.description}`}
                          className="text-darkText/80"
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div>
            <Paragraph text="Row Expectations" className="underline" />
            <div>
              {mode.toLowerCase() === "contractor"
                ? requirements.map((item) => {
                    return (
                      <div key={item.schema} className="flex gap-1">
                        <Paragraph
                          text={`${item.validation}`}
                          className="text-darkText/80"
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default BulkAddHoverCard;
