import React from "react";
import { Link } from "gatsby";
import { LocaleConsumer } from "../components/locale-context";

const NotFoundPage = () => (
  <LocaleConsumer>
    {locale => (
      <>
        <h1>{locale.messages.notFound.doesNotExist}</h1>
        <Link to={`/${locale.language}/`}>
          {locale.messages.notFound.returnToHome}
        </Link>
      </>
    )}
  </LocaleConsumer>
);

export default NotFoundPage;
