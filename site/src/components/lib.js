import React, { useContext } from "react";
import { LocaleContext } from "./locale-context";
import { useStaticQuery, graphql, Link } from "gatsby";
import Img from "gatsby-image";

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

const Image = ({ filename, alt }) => {
  const { images } = useStaticQuery(graphql`
    query {
      images: allFile {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `);

  const image = images.edges.find(n => n.node.relativePath.includes(filename));

  if (!image) {
    console.log(`No image found for path ${filename}`);
    return null;
  }

  return <Img alt={alt} fluid={image.node.childImageSharp.fluid} />;
};

export { LocalizeLink, Localize, Image };
export { LocaleContext, LocationContext } from "./locale-context";
