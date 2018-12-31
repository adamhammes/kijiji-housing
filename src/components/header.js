import React from "react";
import LanguageSwitcher from "./language-switcher";
import { LocalizedLink } from "./lib";

const Header = ({ siteTitle }) => (
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
        <LocalizedLink
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          {siteTitle}
        </LocalizedLink>
      </h1>
      <LanguageSwitcher className="header-language-switcher" />
    </div>
  </header>
);

export default Header;
