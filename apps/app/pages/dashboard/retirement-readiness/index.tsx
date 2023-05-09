import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import RetirementReadinessDashboard from "@dashboards/economy/retirement-readiness";
import { withi18n } from "@lib/decorators";

const RetirementReadiness: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-retirement-readiness", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <RetirementReadinessDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-retirement-readiness",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-retirement-readiness",
          type: "dashboard",
          category: "economy",
          agency: "EPF",
        },
      },
    };
  }
);

export default RetirementReadiness;
