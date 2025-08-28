import Header6 from "@/components/fontsize/Header6";
import { images } from "@/utils/dataTools";
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../../carousel";
import { User } from "@/types/types";
import { toast } from "sonner";
import Submit from "../../../buttons/Submit";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/client";

function AppearanceSettings({ user }: { readonly user: User | undefined }) {
  const [bgSelect, setBgSelect] = useState(0);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleImageSubmit() {
    setLoading(true);

    // DO NOTHING IF THE SELECTED BACKGROUND IS THE SAME AS THE PREEXISTING BACKGROUND IMAGE
    // WHEN SUBMIT IS CLICKED
    if (bgSelect === user?.bg_image_index || !user) {
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          bg_image_index: bgSelect,
        })
        .eq("id", user.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });
      }

      toast("Success!", {
        description: "Background image was updated successfully!",
      });
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      setBgSelect(user.bg_image_index);
    }
  }, [user]);

  return (
    <section className="mb-6">
      <Header6 text="Appearance settings" className="text-darkText mb-4" />
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Set a background</AccordionTrigger>
            <AccordionContent>
              <Carousel
                className="w-[70%] mx-auto mt-4"
                // ENABLES FOR THE CAROUSEL TO LOOP SEAMLESSLY
                opts={{
                  loop: true,
                }}
              >
                <CarouselContent className="">
                  {images.map((item, i) => (
                    <CarouselItem key={item.image} className="basis-1/3">
                      <button
                        type="button"
                        onClick={() => setBgSelect(i)}
                        className={`${
                          i === bgSelect
                            ? "border-2 border-lightText"
                            : "border-none"
                        } rounded-md hover:opacity-80 duration-300 w-full h-[55px] bg-cover bg-center bg-no-repeat`}
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="flex justify-end mt-4">
                <Submit
                  loading={loading}
                  disabledLogic={bgSelect === user?.bg_image_index}
                  buttonClick={handleImageSubmit}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default AppearanceSettings;
