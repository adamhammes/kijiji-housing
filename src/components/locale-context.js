import React from "react";
import messages from "../messages.json";
import { Layout } from "../components/layout";
import { objectFromIterable } from "../lib/utils";

const languages = Object.keys(messages);

const createLocale = language => {
  const messageFunction = (messageId, params) => {
    if (messages[language][messageId] == null) {
      throw new Error(
        `Could not find message with id '${messageId}' in the ${language} locale.`
      );
    }

    return messages[language][messageId](params);
  };

  messageFunction.language = language;
  messageFunction.allLanguages = languages;

  return messageFunction;
};

const locales = objectFromIterable(
  languages.map(lang => [lang, createLocale(lang)])
);

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

export { wrapPageElement, LocaleConsumer, LocaleContext, languages };
