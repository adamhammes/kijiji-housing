import React, { useContext } from "react";
import { Link } from "gatsby";
import { LocaleContext } from "../components/locale-context";

const NotFoundPage = () => {
  const locale = useContext(LocaleContext);

  return (
    <>
      <h1>{locale("notFound.doesNotExist")}</h1>
      <Link to={`/${locale.language}/`}>{locale("notFound.returnToHome")}</Link>
    </>
  );
};

export default NotFoundPage;
