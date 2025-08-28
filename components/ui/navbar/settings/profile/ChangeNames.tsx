"use client";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Input from "@/components/ui/input/Input";
import { toast } from "sonner";
import { User } from "@/types/types";
import Submit from "@/components/ui/buttons/Submit";

type Names = {
  readonly user: User | undefined;
};

function ChangeNames({ user }: Names) {
  

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Update names</AccordionTrigger>
        <AccordionContent>
          <form>
            {/* <Input htmlFor={"first_name"} label={"First name"}>
              <input
                className="form"
                id="first_name"
                name="first_name"
              />
            </Input>
            <Input htmlFor={"last_name"} label={"Last name"} className="mt-3">
              <input
                className="form"
                id="last_name"
                name="last_name"
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={
                  user?.first_name === state?.data?.first_name &&
                  user?.last_name === state?.data?.last_name
                }
              />
            </div> */}
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ChangeNames;
