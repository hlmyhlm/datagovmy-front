import { FunctionComponent, useMemo } from "react";
import dynamic from "next/dynamic";
import { OptionType, WithData } from "datagovmy-ui/types";
import { HeatmapData, HeatmapDatum } from "datagovmy-ui/charts/heatmap";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { Dropdown, Section } from "datagovmy-ui/components";

const Heatmap = dynamic(() => import("datagovmy-ui/charts/heatmap"), { ssr: false });

interface HeatmapProps {
  heatmap: WithData<Record<"abs" | "rate", HeatmapData>>;
}

const PaduTrackerHeatmap: FunctionComponent<HeatmapProps> = ({ heatmap }) => {
  const { t } = useTranslation(["dashboard-padu-tracker"]);

  const OPTIONS: Array<OptionType> = ["rate", "abs"].map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const { data: dropdown, setData } = useData({
    options: OPTIONS[0].value,
  });

  const options = dropdown.options as "abs" | "rate";

  const data = useMemo<HeatmapData>(
    () =>
      heatmap.data[options].map((item: HeatmapDatum) => ({
        x: item.y,
        y: t(`keys.${item.x}`),
        z: item.z,
      })),
    [options]
  );

  return (
    <Section
      title={t("section_heatmap.title")}
      description={
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
            <Dropdown
              width="min-w-[150px]"
              anchor="left"
              options={OPTIONS}
              selected={OPTIONS.find(option => dropdown.options === option.value)}
              onChange={e => setData("options", e.value)}
            />
          </div>
        </div>
      }
      date={heatmap.data_as_of}
    >
      <Heatmap
        className="flex h-full lg:justify-center"
        height={350}
        color="blues"
        precision={[1, 1]}
        data={data}
      />
    </Section>
  );
};

export default PaduTrackerHeatmap;
