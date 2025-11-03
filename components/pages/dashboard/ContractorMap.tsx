import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import React, { useMemo } from "react";
import { Project } from "@/types/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function ContractorMap({
  projects,
  selectedProject,
}: {
  readonly projects: Project[] | undefined;
  readonly selectedProject: string;
}) {
  
  // Aggregate counts only once per render
  const countryCounts = useMemo(() => {
      if (!projects || !selectedProject.length) {
        return
      }

      const project = projects.find(item => item.id === selectedProject)

      if (!project) {
      return;
    }

    if (project.contractors) { 
        const contractors = project.contractors;

        return contractors.reduce((acc, curr) => {
          acc[curr.country] = (acc[curr.country] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    }
  }, []);

  // Create color scale
  const colorScale = useMemo(() => {
    if (!countryCounts) {
        return
    }

    const maxCount = Math.max(...Object.values(countryCounts));
    return scaleLinear<string>()
      .domain([0, maxCount])
      .range(["#D2D7CD", "#7c8d6c"]);
  }, [countryCounts]);

  

  return (
    <div className="h-full w-full">
      {countryCounts ? (
        <div className=" w-full">
          <ChartHeading
            text="Contractors Distribution"
            subtext="Countries shaded darker represent more active contractors"
          />
          <ComposableMap
          className="-my-10"
            projectionConfig={{
              scale: 150,
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const count = countryCounts[countryName] || 0;
                  const fillColor = colorScale ? colorScale(count) : "#fff"

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#ececec90"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#7c8d6c", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default ContractorMap;
