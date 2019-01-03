import React, { useContext } from "react";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

import { LocaleContext } from "./locale-context";
import Header from "./header";
import "./layout.scss";
import "./app.scss";

const Layout = ({ children, renderHeader = true }) => {
  const locale = useContext(LocaleContext);

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
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
              <div
                style={{
                  margin: "0 auto",
                  maxWidth: 960,
                  padding: "0px 1.0875rem 1.45rem",
                  paddingTop: 0,
                }}
              >
                {children}
              </div>
            </>
          ) : (
            children
          )}
        </>
      )}
    />
  );
};

export { Layout };
