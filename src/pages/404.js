import React from "react";
import Layout from "../components/layout";
import { Link } from "gatsby";

const NotFoundPage = ({ pageContext }) => {
  const { locale } = pageContext;

  const homePath = `/${locale.language}/`;

  return (
    <Layout locale={locale}>
      <h1>{locale.messages.notFound.doesNotExist}</h1>
      <Link to={homePath}>{locale.messages.notFound.returnToHome}</Link>
    </Layout>
  );
};

export default NotFoundPage;
