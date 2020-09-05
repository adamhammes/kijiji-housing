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

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;

  const data = loadData();

  data.cities.forEach(city => {
    const nodeContent = JSON.stringify(city);
    console.log(`creating node for ${city.short_code}`);

    const nodeMeta = {
      id: createNodeId(`kijiji-data-origin-${city.short_code}`),
      parent: null,
      children: [],
      internal: {
        type: `kijijiCity`,
        mediaType: `application/json`,
        content: nodeContent,
        contentDigest: createContentDigest(city),
      },
    };

    const node = Object.assign({}, city, nodeMeta);
    createNode(node);
  });
};

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
  if (fs.existsSync(`frontend.sqlite3`)) {
    cb();
    return;
  }

  console.log("No local database found, downloading from s3");

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

  console.log("Attempt");
  s3.listObjectsV2(
    { Bucket: "kijiji-apartments", Prefix: "v3/" },
    (err, data) => {
      if (err) {
        console.error(err);
      }

      const objectNames = data.Contents.map(d => d.Key).filter(name =>
        name.includes("frontend")
      );
      objectNames.sort();
      const newestData = objectNames[objectNames.length - 1];

      const downloadOptions = {
        Bucket: "kijiji-apartments",
        Key: newestData,
      };

      console.log("Downloading latest scraped data...");
      s3.getObject(downloadOptions, (err, data) => {
        if (err) {
          console.error(err);
        }
        fs.writeFileSync("frontend.sqlite3.gz", data.Body);
        gunzip("frontend.sqlite3.gz", "frontend.sqlite3", () => cb());
      });
    }
  );
};

const createLocalizedPages = (page, createPage, createRedirect, deletePage) => {
  return;
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
  console.log("create pages");
  const { createPage, createRedirect } = actions;
  const scraped_data = loadData();

  const cities = scraped_data.cities.filter(city =>
    whitelistedCities.includes(city.short_code)
  );

  const ad_type = { id: "rent" };
  for (const city of cities) {
    // createLocalizedPages(
    //   {
    //     path: `/${city.short_code}/`,
    //     component: path.resolve(`./src/templates/city-display.js`),
    //     context: {
    //       city,
    //     },
    //   },
    //   createPage,
    //   createRedirect
    // );

    const rawOffers = scraped_data.apartments.filter(
      apartment => apartment.origin === city.short_code
    );

    const slug = `/${city.short_code}/rent/`;
    const scrapeId = new Date().toISOString();

    const { offers, descriptions, roomsEnabled } = splitAndFilter(
      rawOffers,
      city,
      ad_type
    );

    const hash = createContentDigest(descriptions);
    const descriptionsPath = path.join(
      API_PATH,
      `/${city.short_code}-${ad_type.id}-descriptions-${hash}.json`
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
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage, createRedirect } = actions;

  return new Promise(resolve => {
    const _delete = page.path.startsWith("/404.html") ? null : deletePage;

    createLocalizedPages(page, createPage, createRedirect, _delete);

    resolve();
  });
};
