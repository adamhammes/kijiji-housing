const fs = require("fs");
const path = require(`path`);
const Database = require("better-sqlite3");
const gunzip = require("gunzip-file");

const aws = require("aws-sdk");
const languages = ["fr", "en"];
const defaultLang = "en";

const loadData = () => {
  const db = new Database("frontend.sqlite3");

  return {
    cities: db.prepare("SELECT * FROM ScrapeOrigin").all(),
    apartments: db.prepare("SELECT * FROM Apartment").all(),
  };
};

const { splitAndFilter, whitelistedCities } = require("./src/lib/build_helper");
const { gunzipSync } = require("zlib");

const API_PATH = "./static/api";

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /leaflet/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\bmessages\.json$/,
          type: "javascript/auto",
          loader: require.resolve("messageformat-loader"),
          options: {
            locale: languages,
          },
        },
      ],
    },
  });
};
