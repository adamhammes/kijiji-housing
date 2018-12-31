import React, { useContext } from "react";
import { LocaleContext } from "./locale-context";
import { Link } from "gatsby";

const LocalizedLink = ({ to, children, linkProps }) => {
  const locale = useContext(LocaleContext);

  const localizedTo = `/${locale.language}/${to}`;

  return (
    <Link {...linkProps} to={localizedTo}>
      {children}
    </Link>
  );
};

const Message = ({ children, ...args }) => {
  const locale = useContext(LocaleContext);
  const messageId = children;

  return locale(messageId, args);
};

export { LocalizedLink, Message };
