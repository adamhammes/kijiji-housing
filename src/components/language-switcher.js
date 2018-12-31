import React, { useContext } from "react";
import { LocaleContext, LocationContext } from "./locale-context";
import { Link } from "gatsby";

const languageReplace = {
  fr: "en",
  en: "fr",
};

const LanguageSwitcher = linkProps => {
  const locale = useContext(LocaleContext);
  const otherLang = languageReplace[locale.language];

  const location = useContext(LocationContext);
  const alternativePath = `/${otherLang}${location.pathname.substring(3)}`;

  return (
    <Link {...linkProps} to={alternativePath}>
      {locale("alternateLang")}
    </Link>
  );
};

export default LanguageSwitcher;
