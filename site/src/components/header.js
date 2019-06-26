import React from "react";
import LanguageSwitcher from "./language-switcher";
import { LocalizeLink } from "./lib";

const Header = ({ siteTitle }) => (
  <header className="bg-primary leading-snug">
    <div className="max-w-4xl mx-auto p-8">
      <LocalizeLink
        to="/"
        className="text-white font-sans shadow-none font-bold text-3xl"
      >
        {siteTitle}
      </LocalizeLink>
      <LanguageSwitcher className="header-language-switcher" />
    </div>
  </header>
);

export default Header;
