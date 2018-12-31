import { Link } from "gatsby";
import React, { useContext } from "react";
import { LocaleContext } from "./locale-context";
import LanguageSwitcher from "./language-switcher";

const Header = ({ siteTitle }) => {
  const lang = useContext(LocaleContext).language;

  return (
    <header
      style={{
        background: "#EA5500",
        marginBottom: "1.45rem",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: 960,
          padding: "1.45rem 1.0875rem",
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to={`/${lang}`}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        <LanguageSwitcher className="header-language-switcher" />
      </div>
    </header>
  );
};

export default Header;
