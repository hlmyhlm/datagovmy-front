import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { Dropdown, Input, Section, StateDropdown, Tabs } from "@components/index";
import { List, Panel } from "@components/Tabs";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";
import { FlagIcon, MagnifyingGlassIcon, MapIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import { CountryAndStates } from "@lib/constants";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import Waffle from "@components/Chart/Waffle";
import type { TableConfig } from "@components/Chart/Table";
import Card from "@components/Card";

/**
 * Election Explorer Dashboard - Elections Tab
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface ElectionProps {}

const Election: FunctionComponent<ElectionProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-election-explorer"]);

  const PANELS = [
    {
      name: t("dashboard-election-explorer:parliament"),
      icon: <BuildingLibraryIcon className="mr-1 h-5 w-5" />,
    },
    { name: t("dashboard-election-explorer:state"), icon: <FlagIcon className="mr-1 h-5 w-5" /> },
  ];

  const ELECTION_OPTIONS: Array<OptionType> = [
    "GE-15 (2022)",
    "GE-14 (2018)",
    "GE-13 (2013)",
    "GE-12 (2008)",
    "GE-11 (2004)",
    "GE-10 (1999)",
    "GE-9 (1995)",
    "GE-8 (1990)",
    "GE-7 (1986)",
    "GE-6 (1982)",
    "GE-5 (1978)",
    "GE-4 (1974)",
    "GE-3 (1969)",
    "GE-2 (1964)",
    "GE-1 (1959)",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const FILTER_OPTIONS: Array<OptionType> = ["voter-turnout"].map((key: string) => ({
    label: t(`dashboard-election-explorer:${key}`),
    value: key,
  }));

  const tableConfig: TableConfig[] = [
    {
      id: "name",
      header: "Candidate Name",
    },
    {
      id: "total",
      columns: [
        {
          id: "total.perc_1dose",
          header: "% 1 Dose",
          accessorKey: "total.perc_1dose",
        },
      ],
    },
  ];

  const dummy = Array(5)
    .fill(0)
    .map((_, index) => {
      return {
        id: index,
        name: "name",
        total: {
          perc_1dose: Math.floor(Math.random() * 10) + 1,
        },
      };
    });

  const { data, setData } = useData({
    tabs: 0,
    tabs_section_1: 0,
    tabs_section_3: 0,
    filter: FILTER_OPTIONS[0],
    election: ELECTION_OPTIONS[0],
    state: "",
  });
  return (
    <>
      <Section>
        <h4 className="py-4 text-center">{t("dashboard-election-explorer:election.section_1")}</h4>
        <div className="sticky top-14 z-10 flex items-center justify-center gap-2 py-3 drop-shadow-xl lg:pl-2">
          <div className="max-w-fit rounded-full border border-outline bg-white p-1 dark:border-washed-dark dark:bg-black">
            <List
              className="flex flex-row py-1"
              options={PANELS.map(item => item.name)}
              icons={PANELS.map(item => item.icon)}
              current={data.tabs}
              onChange={index => setData("tabs", index)}
            />
          </div>
          <StateDropdown
            currentState={data.state}
            onChange={selected => setData("state", selected.value)}
            exclude={["mys", "kul", "lbn", "pjy"]}
            width="min-w-max"
            anchor="left"
            disabled={data.tabs === 0}
          />
          <Dropdown
            anchor="left"
            options={ELECTION_OPTIONS}
            selected={ELECTION_OPTIONS.find(e => e.value === data.election.value)}
            onChange={e => setData("election", e)}
          />
        </div>
        <div className="divide-y divide-y-reverse border-outlineHover-dark">
          <Tabs hidden current={data.tabs} onChange={index => setData("tabs", index)}>
            {PANELS.map((panel, index) => (
              <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
                <div className="py-12 lg:grid lg:grid-cols-12">
                  <div className="py-6 lg:col-span-10 lg:col-start-2">
                    <Tabs
                      className="py-6"
                      title={
                        <div className="text-base font-bold">
                          {t("dashboard-election-explorer:parliament_of", {
                            state:
                              data.tabs === 0
                                ? CountryAndStates["mys"]
                                : CountryAndStates[data.state],
                            election: data.election.value,
                          })}
                          <span className="text-primary">
                            {data.tabs === 0
                              ? CountryAndStates["mys"]
                              : CountryAndStates[data.state]}
                          </span>
                          <span>: </span>
                          <span className="text-primary">{data.election.value}</span>
                        </div>
                      }
                      current={data.tabs_section_1}
                      onChange={index => setData("tabs_section_1", index)}
                    >
                      <Panel name={t("dashboard-election-explorer:summary")}>
                        {/* <Waffle
                          className="w-full"
                          title={
                            <div className="flex self-center text-base font-bold">{"test"}</div>
                          }
                          color={"#5A5A5A"}
                          rows={3}
                          cols={74}
                        /> */}
                      </Panel>
                      <Panel
                        name={t("dashboard-election-explorer:map")}
                        icon={<MapIcon className="mr-1 h-5 w-5" />}
                      >
                        <div className="py-6">
                          <Choropleth />
                        </div>
                      </Panel>
                      <Panel
                        name={t("dashboard-election-explorer:table")}
                        icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                      >
                        <div className="py-6">
                          <Table />
                        </div>
                      </Panel>
                    </Tabs>
                  </div>
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
          <div className="py-12 lg:grid lg:grid-cols-12">
            <div className="lg:col-span-10 lg:col-start-2">
              <h4 className="py-4 text-center">
                {t("dashboard-election-explorer:election.section_2")}
              </h4>
              {/* <Input
                  className="w-96 rounded-full border"
                  type="search"
                  placeholder={t("dashboard-election-explorer:search_area")}
                  value={data.search}
                  onChange={e => setData("search", e)}
                  icon={<MagnifyingGlassIcon className="h-4 w-4 self-center lg:h-5 lg:w-5" />}
                /> */}
              <div className="py-6">
                <Table className="table" data={dummy} config={tableConfig} />
              </div>
            </div>
          </div>
        </div>
        <div className="py-12 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-2">
            <h4 className="py-4 text-center">
              {t("dashboard-election-explorer:election.section_3")}
            </h4>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <Dropdown
                anchor="left"
                width="w-fit"
                options={FILTER_OPTIONS}
                selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                onChange={e => setData("filter_age", e)}
              />
              <List
                className="flex flex-row py-1"
                options={[
                  t("dashboard-election-explorer:map"),
                  t("dashboard-election-explorer:table"),
                ]}
                icons={[
                  <MapIcon className="mr-1 h-5 w-5" />,
                  <TableCellsIcon className="mr-1 h-5 w-5" />,
                ]}
                current={data.tabs_section_3}
                onChange={index => setData("tabs_section_3", index)}
              />
            </div>
            <Tabs
              hidden
              current={data.tabs_section_3}
              onChange={index => setData("tabs_section_3", index)}
            >
              <Panel
                name={t("dashboard-election-explorer:map")}
                icon={<MapIcon className="mr-1 h-5 w-5" />}
              >
                <div className="py-6">
                  <Card
                    className="flex h-[600px] rounded-xl border border-outline dark:border-washed-dark"
                    type="gray"
                  >
                    <Choropleth />
                  </Card>
                </div>
              </Panel>
              <Panel
                name={t("dashboard-election-explorer:table")}
                icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
              >
                <div className="py-6">
                  <Table />
                </div>
              </Panel>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Election;
