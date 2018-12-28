import React from "react";
import frLocale from "../translations/translations.fr.json";
import enLocale from "../translations/translations.en.json";
import { Layout } from "../components/layout";

const locales = {
  en: enLocale,
  fr: frLocale,
};

const defaultLocale = locales.fr;
const LocaleContext = React.createContext(defaultLocale);
const LocaleConsumer = LocaleContext.Consumer;

const wrapPageElement = ({ element, props }) => {
  const { pathname } = props.location;
  const language = pathname.startsWith("/en/") ? "en" : "fr";
  const locale = locales[language];

  const contextValue = locale;
  const renderHeader = props.pageContext.pageType !== "offerDisplay";

  return (
    <LocaleContext.Provider value={contextValue}>
      <Layout renderHeader={renderHeader}>{element}</Layout>
    </LocaleContext.Provider>
  );
};

export { wrapPageElement, LocaleConsumer, LocaleContext };
