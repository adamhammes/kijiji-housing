import React, { useContext } from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

import { LocaleContext } from "./locale-context";
import Header from "./header";
import "./layout.scss";
import "./app.scss";

const Layout = ({ children, renderHeader = true }) => {
  const locale = useContext(LocaleContext);
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          {
            name: "description",
            content: locale("meta.description"),
          },
        ]}
      >
        <html lang={locale.language} />
      </Helmet>
      {renderHeader ? (
        <>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div className="leading-snug max-w-4xl px-8 mx-auto">{children}</div>
        </>
      ) : (
        children
      )}
    </>
  );
};

export { Layout };
