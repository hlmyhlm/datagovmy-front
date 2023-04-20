import "../styles/globals.css";
import { appWithTranslation, useTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import Layout from "@components/Layout";
import { useEffect, ReactNode, useState, createContext } from "react";
import { useRouter } from "next/router";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, init_session } from "@lib/mixpanel";
import Fonts from "@config/font";
import { ThemeProvider } from "next-themes";
import Nexti18NextConfig from "../next-i18next.config";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  //   const { i18n } = useTranslation();
  const layout =
    Component.layout ??
    ((page: ReactNode) => (
      <Layout className={[Fonts.body.variable, "font-sans"].join(" ")}>{page}</Layout>
    ));
  const router = useRouter();
  //   i18n.reloadResources();

  // Mixpanel initialisation
  useEffect(() => {
    // window.mixpanel.init(mixpanelConfig.token, {
    //   debug: true,
    //   api_host: "https://api.mixpanel.com",
    // });
  }, []);

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      //   ga_track(url);
      //   init_session();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <ThemeProvider attribute="class" enableSystem={false}>
        {layout(
          <div
            className={[Fonts.body.variable, Fonts.header.variable, "font-sans dark:bg-black"].join(
              " "
            )}
          >
            <Component {...pageProps} />
          </div>
        )}
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
