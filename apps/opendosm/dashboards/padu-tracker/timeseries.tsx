import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { WithData } from "datagovmy-ui/types";
import { TimeseriesCalloutOptions, TimeseriesData, TimeseriesOptions } from ".";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { Section, Slider } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat } from "datagovmy-ui/helpers";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

interface TimeseriesProp {
  timeseries: WithData<TimeseriesOptions>;
  timeseries_callout: WithData<
    Record<Exclude<TimeseriesData, "x">, Record<TimeseriesCalloutOptions, number>>
  >;
}

const PaduTrackerTimeseries: FunctionComponent<TimeseriesProp> = ({
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-padu-tracker"]);

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const plotTimeseries = (charts: Exclude<TimeseriesData, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: "",
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: true,
        stats: [
          {
            title: t(`keys.daily`),
            value: `+${numFormat(timeseries_callout.data[name].daily, "standard", 0, "long")}`,
          },
          {
            title: t(`keys.cumul`),
            value: `${numFormat(timeseries_callout.data[name].cumul, "standard")}`,
          },
          {
            title: name === "activations" ? t(`keys.activations_rate`) : t(`keys.submissions_rate`),
            value: `${numFormat(timeseries_callout.data[name].rate, undefined, 1, "long")}%`,
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="day"
          enableAnimation={!play}
          beginZero={false}
          suggestedMinY={50}
          axisY={{
            y2: {
              display: false,
              grid: {
                drawTicks: false,
                drawBorder: false,
                lineWidth: 0.5,
              },
              ticks: {
                display: false,
              },
            },
          }}
          data={{
            labels: coordinate.x,
            datasets: [
              {
                type: "line",
                label: label,
                data: datum,
                backgroundColor: AKSARA_COLOR.PRIMARY_H,
                borderColor: AKSARA_COLOR.PRIMARY,
                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <Section title={t("section_timeseries.title")} date={timeseries.data_as_of}>
      <SliderProvider>
        {play => (
          <>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {plotTimeseries(["activations", "submissions"], play)}
            </div>
            <Slider
              type="range"
              period="auto"
              value={data.minmax}
              onChange={e => setData("minmax", e)}
              data={timeseries.data.x}
            />
          </>
        )}
      </SliderProvider>
    </Section>
  );
};

export default PaduTrackerTimeseries;
