const siteName = "À la carte";

module.exports = {
  siteMetadata: {
    title: siteName,
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.svg$/,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteName,
        short_name: siteName,
        start_url: "/",
        background_color: "#EA5500",
        theme_color: "#EA5500",
        display: "minimal-ui",
        icon: "src/favicon.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./static/api/all.json",
      },
    },
    "gatsby-plugin-sass",
    "gatsby-plugin-favicon",
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        // develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        whitelistPatterns: [/leaflet/, /marker/, /gatsby/], // Don't remove this selector
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/*.js": ["cache-control: public, max-age=31536000, immutable"],
          "/*.css": ["cache-control: public, max-age=31536000, immutable"],
          "/api/*.json": ["cache-control: public, max-age=31536000, immutable"],
          "/api/all.json": [
            "cache-control: public, max-age=0, must-revalidate",
          ],
          "/sw.js": ["cache-control: public, max-age=0, must-revalidate"],
        },
      },
    },
  ],
};
