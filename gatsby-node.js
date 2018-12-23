const fs = require("fs");
const path = require(`path`);

const aws = require("aws-sdk");
const { languages, locales } = require("./src/translations/translations");

const { splitAndFilter } = require("./src/lib/build_helper");

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
};

exports.onPreInit = (_, pluginOptions, cb) => {
  if (fs.existsSync(`${API_PATH}/all.json`)) {
    cb();
    return;
  }

  const { _AWS_ACCESS_KEY_ID, _AWS_SECRET_ACCESS_KEY } = process.env;

  if (!_AWS_ACCESS_KEY_ID || !_AWS_SECRET_ACCESS_KEY) {
    throw new Error("Missing environment variables");
  }

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

exports.createPages = ({ actions }) => {
  const { createPage, createRedirect } = actions;
  const scraped_data = require(`${API_PATH}/all.json`);

  for (const city of scraped_data.cities) {
    for (const ad_type of scraped_data.ad_types) {
      const rawOffers = scraped_data.offers[city.id][ad_type.id];

      const slug = `${city.id}/${ad_type.id}`;
      const scrapeId = scraped_data.date_collected;

      const { offers, descriptionMapping } = splitAndFilter(rawOffers);

      fs.writeFileSync(
        `${API_PATH}/${scrapeId}_${city.id}-${ad_type.id}-descriptions.json`,
        JSON.stringify(descriptionMapping)
      );

      for (const lang of languages) {
        createPage({
          path: `/${lang}/${slug}`,
          component: path.resolve(`./src/templates/offers-display.js`),
          context: {
            locale: locales[lang],
            scrapeId,
            city,
            ad_type,
            offers,
          },
        });

        if (lang === "fr") {
          createRedirect({ fromPath: slug, toPath: `/${lang}/${slug}` });
        }
      }
    }
  }
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage, createRedirect } = actions;

  return new Promise(resolve => {
    for (const language of languages) {
      const newPage = Object.assign({}, page);
      const locale = locales[language];

      newPage.path = `/${language}${page.path}`;
      newPage.context = { ...page.context, language, locale };

      createPage(newPage);

      if (language === "fr") {
        createRedirect({ fromPath: page.path, toPath: newPage.path });
      }
    }

    deletePage(page);

    resolve();
  });
};
