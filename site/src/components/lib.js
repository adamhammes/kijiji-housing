import React, { useContext } from "react";
import { LocaleContext } from "./locale-context";
import { Link } from "gatsby";

const LocalizeLink = ({ to, children, ...linkProps }) => {
  const locale = useContext(LocaleContext);

  const localizedTo = `/${locale.language}/${to}`;

  return (
    <Link {...linkProps} to={localizedTo}>
      {children}
    </Link>
  );
};

const Localize = ({ children, ...args }) => {
  const locale = useContext(LocaleContext);
  const messageId = children;

  return locale(messageId, args);
};

export { LocalizeLink, Localize };
export { LocaleContext, LocationContext } from "./locale-context";
