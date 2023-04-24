import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";

const InternetPenetration: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-internet-penetration", "common"]);

  return (
    <>
      <Metadata
        title={t("dashboard-internet-penetration:header")}
        description={t("dashboard-internet-penetration:description")}
        keywords={""}
      />
      <InternetPenetrationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-internet-penetration", "common"]);
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default InternetPenetration;
