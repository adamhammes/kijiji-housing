const fs = require("fs");
const path = require(`path`);

const aws = require("aws-sdk");
const languages = ["fr", "en"];
const defaultLang = "en";

const { splitAndFilter, whitelistedCities } = require("./src/lib/build_helper");

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

exports.onPreInit = (_, pluginOptions, cb) => {
  if (fs.existsSync(`${API_PATH}/all.json`)) {
    cb();
    return;
  }

  if (
    !"_AWS_ACCESS_KEY_ID" in process.env ||
    !"_AWS_SECRET_ACCESS_KEY" in process.env
  ) {
    throw new Error("Missing environment variables");
  }
  const { _AWS_ACCESS_KEY_ID, _AWS_SECRET_ACCESS_KEY } = process.env;

  aws.config.update({
    accessKeyId: _AWS_ACCESS_KEY_ID,
    secretAccessKey: _AWS_SECRET_ACCESS_KEY,
    region: "us-east-2",
  });

  const s3 = new aws.S3();

  const downloadOptions = {
    Bucket: "kijiji-apartments",
    Key: "v2/latest/out.json",
  };

  console.log("Downloading latest scraped data...");
  s3.getObject(downloadOptions, (err, data) => {
    if (err) {
      console.error(err);
    }
    fs.writeFileSync("static/api/all.json", data.Body);
    cb();
  });
};

const createLocalizedPages = (page, createPage, createRedirect, deletePage) => {
  languages.forEach(lang => {
    const localizedPath = `/${lang}${page.path}`;
    const localizedPage = { ...page, path: localizedPath };

    createPage(localizedPage);
    if (lang === defaultLang) {
      createRedirect({
        fromPath: page.path,
        toPath: localizedPath,
      });
    }
  });

  if (deletePage) deletePage(page);
};

exports.createPages = ({ actions, createContentDigest }) => {
  const { createPage, createRedirect } = actions;
  const scraped_data = require(`${API_PATH}/all.json`);

  scraped_data.cities = scraped_data.cities.filter(city =>
    whitelistedCities.includes(city.id)
  );

  for (const city of scraped_data.cities) {
    createLocalizedPages(
      {
        path: `/${city.id}/`,
        component: path.resolve(`./src/templates/city-display.js`),
        context: {
          city,
        },
      },
      createPage,
      createRedirect
    );

    for (const ad_type of scraped_data.ad_types) {
      const rawOffers = scraped_data.offers[city.id][ad_type.id];

      const slug = `/${city.id}/${ad_type.id}/`;
      const scrapeId = scraped_data.date_collected;

      const { offers, descriptions, roomsEnabled } = splitAndFilter(
        rawOffers,
        city,
        ad_type
      );

      const hash = createContentDigest(descriptions);
      const descriptionsPath = path.join(
        API_PATH,
        `/${city.id}-${ad_type.id}-descriptions-${hash}.json`
      );

      fs.writeFileSync(descriptionsPath, JSON.stringify(descriptions));

      createLocalizedPages(
        {
          path: slug,
          component: path.resolve(`./src/templates/offers-display.js`),
          context: {
            scrapeId,
            city,
            ad_type,
            offers,
            roomsEnabled,
            descriptionsPath: descriptionsPath.substring("static".length),
            pageType: "offerDisplay",
          },
        },
        createPage,
        createRedirect
      );
    }
  }
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage, createRedirect } = actions;

  return new Promise(resolve => {
    const _delete = page.path.startsWith("/404.html") ? null : deletePage;

    createLocalizedPages(page, createPage, createRedirect, _delete);

    resolve();
  });
};
