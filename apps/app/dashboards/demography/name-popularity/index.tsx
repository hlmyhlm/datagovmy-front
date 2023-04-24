import AgencyBadge from "@components/AgencyBadge";
import Card from "@components/Card";
import Chips from "@components/Chips";
import { JPNIcon } from "@components/Icon/agency";
import { Button, Container, Hero, Input, Radio, Section } from "@components/index";
import Toggle from "@components/Toggle";
import Spinner from "@components/Spinner";
import { OptionType } from "@components/types";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { get } from "@lib/api";
import { BREAKPOINTS } from "@lib/constants";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
/**
 * Name Popularity Dashboard
 * @overview Status: Live
 */

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface NamePopularityDashboardProps {}

const NamePopularityDashboard: FunctionComponent<NamePopularityDashboardProps> = () => {
  const { t, i18n } = useTranslation(["dashboard-name-popularity", "common"]);
  const windowWidth = useWindowWidth();
  const showPlaceholder = windowWidth >= BREAKPOINTS.LG;

  const { data: searchData, setData: setSearchData } = useData({
    type: { label: t("dashboard-name-popularity:first_name"), value: "first" },
    name: "",
    validation: false,
    params: {},
    data: null,
    loading: false,
  });

  const { data: compareData, setData: setCompareData } = useData({
    type: { label: t("dashboard-name-popularity:first_name"), value: "compare_first" },
    name: "",
    names: [],
    validation: false,
    compare_name: "true",
    params: {},
    data: null,
    loading: false,
  });

  const { theme } = useTheme();

  // trigger API calls when parameters (user inputs) are updated
  useWatch(() => {
    setSearchData("loading", true);
    get("/explorer", searchData.params)
      .then(({ data }) => {
        setSearchData("data", data);
      })
      .then(() => setSearchData("loading", false));
  }, [searchData.params]);

  useWatch(() => {
    setCompareData("loading", true);
    get("/explorer", compareData.params)
      .then(({ data }) => {
        setCompareData("data", data);
      })
      .then(() => setCompareData("loading", false));
  }, [compareData.params]);

  const filterTypes: Array<OptionType> = [
    { label: t("dashboard-name-popularity:first_name"), value: "first" },
    { label: t("dashboard-name-popularity:last_name"), value: "last" },
  ];

  const compareFilterTypes: Array<OptionType> = [
    { label: t("dashboard-name-popularity:first_name"), value: "compare_first" },
    { label: t("dashboard-name-popularity:last_name"), value: "compare_last" },
  ];

  const processName = (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/\b(\w)/g, (s: string) => s.toUpperCase());
  };

  const searchHandler = () => {
    const name: string = processName(searchData.name);
    if (name.length > 0) {
      setSearchData("params", {
        explorer: "NAME_POPULARITY",
        name: name,
        type: searchData.type.value,
        compare_name: "false",
      });
    } else {
      setSearchData(
        "validation",
        searchData.type.value === "first"
          ? t("dashboard-name-popularity:search_validation_first")
          : t("dashboard-name-popularity:search_validation_last")
      );
    }
  };

  const compareHandler = () => {
    // process "," for android
    if (compareData.name.includes(",")) {
      compareData.name
        .split(",")
        .map((name: string) => processName(name))
        .map((name: string) => {
          compareData.names.findIndex(
            (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
          ) === -1 && compareData.names.push({ label: name, value: name });
        });
    } else {
      const name: string = processName(compareData.name);

      if (name.length > 0) {
        compareData.names.findIndex(
          (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
        ) === -1 && compareData.names.push({ label: name, value: name });
      }
    }

    if (compareData.names.length > 1) {
      setCompareData("params", {
        explorer: "NAME_POPULARITY",
        type: compareData.type.value === "compare_first" ? "first" : "last",
        name: compareData.names
          .map((name: { label: string; value: string }) => name.value)
          .join(","),
        compare_name: "true",
      });
    } else {
      setCompareData("validation", t("dashboard-name-popularity:compare_validation"));
    }
    setCompareData("name", "");
  };

  const compareNameInputHandler = (e: string) => {
    const name = processName(e.split(",")[0].trim());
    if (name.length > 0) {
      compareData.names.findIndex(
        (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
      ) === -1 && compareData.names.push({ label: name, value: name });
    }
  };

  const emojiMap: Record<number, string> = {
    0: "🥇",
    1: "🥈",
    2: "🥉",
  };

  const placeholderData = {
    decade: [
      "1920s",
      "1930s",
      "1940s",
      "1950s",
      "1960s",
      "1970s",
      "1980s",
      "1990s",
      "2000s",
      "2010s",
    ],
    count: [10004, 13409, 30904, 43434, 50694, 75443, 70530, 78667, 62537, 15519],
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("nav.megamenu.categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("dashboard-name-popularity:header")]}
        description={[t("dashboard-name-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<JPNIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        <Section title={t("dashboard-name-popularity:section1_title")}>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="border-outline bg-background dark:border-washed-dark dark:bg-washed-dark/50 flex flex-col justify-start	gap-6 rounded-xl border p-6 shadow">
                <div className="flex flex-row gap-4">
                  <span className="text-sm font-medium">
                    {t("dashboard-name-popularity:search_radio_label")}
                  </span>
                  <Radio
                    name="type"
                    className="inline-flex gap-4"
                    options={filterTypes}
                    value={searchData.type}
                    onChange={e => {
                      setSearchData("type", e);
                    }}
                  />
                </div>
                <Input
                  type="search"
                  className={"dark:focus:border-primary-dark rounded-md border".concat(
                    searchData.validation
                      ? " border-danger dark:border-danger border-2"
                      : " border-outline border-2 dark:border-zinc-800 dark:bg-zinc-900"
                  )}
                  placeholder={
                    searchData.type.value === "last"
                      ? "E.g. Ibrahim, Loke, Veerapan"
                      : "E.g. Anwar, Siew Fook, Sivakumar"
                  }
                  autoFocus
                  value={searchData.name}
                  onChange={e => {
                    setSearchData("validation", false);
                    setSearchData("name", e);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") searchHandler();
                  }}
                  validation={searchData.validation}
                />
                <div className="">
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={searchHandler}
                  >
                    {t("dashboard-name-popularity:search_button")}
                  </Button>
                </div>
                <p className="text-dim text-sm">{t("dashboard-name-popularity:search_details")}</p>
                <p className="text-dim text-sm">
                  {t("dashboard-name-popularity:search_disclaimer")}
                </p>
              </Card>
            </div>
            {!showPlaceholder && !searchData.data ? (
              <></>
            ) : (
              <div
                className={
                  "col-span-full flex max-h-fit place-content-center place-items-center lg:col-span-2"
                }
              >
                {searchData.data ? (
                  <div className="w-full">
                    {searchData.loading ? (
                      <div className="flex h-[460px] items-center justify-center">
                        <Spinner loading={searchData.loading} />
                      </div>
                    ) : (
                      <Bar
                        precision={0}
                        suggestedMaxY={5}
                        className="h-[460px]"
                        title={
                          <>
                            <p className="text-lg font-bold">
                              <span>
                                {t(
                                  `dashboard-name-popularity:bar_title_${searchData.params.type}`,
                                  {
                                    count: searchData.data.total || 0,
                                  }
                                )}
                              </span>
                              <span>{`"${searchData.params.name}".`}</span>
                            </p>
                            <p className="text-dim text-sm">
                              <span>
                                {t("dashboard-name-popularity:bar_description", {
                                  name: searchData.params.name,
                                })}
                              </span>
                            </p>
                          </>
                        }
                        data={{
                          labels: searchData.data.decade
                            ? searchData.data.decade.map((x: string) => x.toString().concat("s"))
                            : placeholderData.decade,
                          datasets: [
                            {
                              data: searchData.data.count,
                              label: "Similar names",
                              borderRadius: 12,
                              barThickness: 12,
                              backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                            },
                          ],
                        }}
                        enableGridX={false}
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-[460px] w-full items-center justify-center">
                    <Bar
                      className="absolute top-0 h-[460px] w-full opacity-30"
                      data={{
                        labels: placeholderData.decade,
                        datasets: [
                          {
                            data: placeholderData.count,
                            borderRadius: 12,
                            barThickness: 12,
                            backgroundColor: theme === "light" ? "#71717A" : "#FFFFFF",
                          },
                        ],
                      }}
                      enableGridX={false}
                      tooltipEnabled={false}
                    />
                    <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark z-10 flex h-min w-fit flex-row items-center gap-2 rounded-md border px-3 py-1.5 md:mx-auto">
                      <MagnifyingGlassIcon className=" h-4 w-4" />
                      <p>{t("dashboard-name-popularity:search_prompt")}</p>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </Section>

        <Section title={t("dashboard-name-popularity:section2_title")}>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="border-outline bg-background dark:border-washed-dark dark:bg-washed-dark/50 flex flex-col justify-start	gap-6 rounded-xl border p-6 shadow">
                <div className="flex flex-col justify-start gap-3">
                  <div className="flex flex-col gap-4">
                    <span className="text-sm font-medium">
                      {t("dashboard-name-popularity:compare_radio")}
                    </span>
                    <Radio
                      name="compare_type"
                      className="inline-flex gap-4"
                      options={compareFilterTypes}
                      value={compareData.type}
                      onChange={e => {
                        setCompareData("type", e);
                      }}
                    />
                  </div>
                  <Input
                    type="search"
                    disabled={compareData.names.length > 9}
                    className={"dark:focus:border-primary-dark rounded-md border".concat(
                      compareData.validation
                        ? " border-danger dark:border-danger border-2"
                        : compareData.names.length > 9
                        ? " border-outline bg-outline text-dim border opacity-30 dark:border-black dark:bg-black"
                        : " border-outline border-2 dark:border-zinc-800 dark:bg-zinc-900"
                    )}
                    placeholder={
                      compareData.type.value === "compare_last"
                        ? "E.g. Ibrahim, Loke, Veerapan"
                        : "E.g. Anwar, Siew Fook, Sivakumar"
                    }
                    value={compareData.name}
                    onChange={e => {
                      setCompareData("validation", false);
                      setCompareData("name", e !== "," ? e : "");
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        compareHandler();
                      } else if (e.key === ",") {
                        compareNameInputHandler((e.target as HTMLInputElement).value);
                        setCompareData("name", "");
                      } else {
                        setCompareData("validation", false);
                      }
                    }}
                    validation={compareData.validation}
                  />
                  {compareData.names.length > 0 && (
                    <Chips
                      data={compareData.names}
                      onRemove={s => {
                        setCompareData(
                          "names",
                          compareData.names.filter((item: OptionType) => s !== item.value)
                        );
                      }}
                      onClearAll={() => setCompareData("names", [])}
                    />
                  )}
                </div>
                <div>
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={compareHandler}
                  >
                    {t("dashboard-name-popularity:compare_button")}
                  </Button>
                </div>

                <p className="text-dim text-sm">
                  {t("dashboard-name-popularity:search_disclaimer")}
                </p>
              </Card>
            </div>

            {!showPlaceholder && !compareData.data ? (
              <></>
            ) : (
              <div className="col-span-full flex h-[460px] flex-col gap-3 lg:col-span-2">
                <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                  <p className="text-lg font-bold">
                    <span>{t("dashboard-name-popularity:compare_title")}</span>
                  </p>
                  <Toggle
                    enabled={false}
                    onStateChanged={checked => setCompareData("order", checked)}
                    label={t("dashboard-name-popularity:compare_toggle")}
                  />
                </div>

                <table className="w-full table-auto border-collapse md:table-fixed">
                  <thead>
                    <tr className="md:text-md border-b-outline dark:border-washed-dark max-w-full border-b-2 text-left text-sm [&>*]:p-2">
                      <th className="md:w-[50px]">#</th>
                      <th className="md:w-1/3">
                        {compareData.params.type === "last"
                          ? t("dashboard-name-popularity:last_name")
                          : t("dashboard-name-popularity:first_name")}
                      </th>
                      <th className="md:w-1/3">{t("dashboard-name-popularity:table_total")}</th>
                      <th className="md:w-1/3">
                        {t("dashboard-name-popularity:table_most_popular")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData.data ? (
                      compareData.data
                        .sort((a: { total: number }, b: { total: number }) =>
                          a.total == 0
                            ? Number.MIN_VALUE
                            : compareData.order
                            ? b.total - a.total
                            : a.total - b.total
                        )
                        .map(
                          (
                            item: { name: string; total: number; max: string; min: string },
                            i: number
                          ) => (
                            <tr
                              className={(i < Math.min(3, compareData.data.length - 1)
                                ? "bg-background dark:border-washed-dark dark:bg-washed-dark/50"
                                : ""
                              ).concat(" md:text-md text-sm")}
                            >
                              <td
                                className={"border-b-outline dark:border-washed-dark border-b p-2".concat(
                                  i < Math.min(3, compareData.data.length - 1)
                                    ? " text-primary dark:text-primary-dark"
                                    : ""
                                )}
                              >
                                {i + 1}
                              </td>
                              <td className="border-b-outline dark:border-washed-dark border-b p-2 capitalize">
                                {`${item.name} `.concat(
                                  i < Math.min(3, compareData.data.length - 1) ? emojiMap[i] : ""
                                )}
                              </td>
                              <td className="border-b-outline dark:border-washed-dark border-b p-2">
                                {item.total.toLocaleString("en-US")}
                              </td>
                              <td className="border-b-outline dark:border-washed-dark border-b p-2">
                                {item.total === 0 ? item.max : item.max.toString().concat("s")}
                              </td>
                            </tr>
                          )
                        )
                    ) : compareData.isLoading ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="grid place-items-center py-3">
                            <Spinner loading={compareData.isLoading} />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark my-3 hidden w-fit flex-row items-center gap-2 rounded-md border px-3 py-1.5 md:mx-auto lg:flex">
                            <MagnifyingGlassIcon className=" h-4 w-4" />
                            <p>{t("dashboard-name-popularity:compare_prompt")}</p>
                          </Card>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default NamePopularityDashboard;
