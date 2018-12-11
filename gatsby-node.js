const fs = require("fs");
const path = require(`path`);

const aws = require("aws-sdk");

const API_PATH = "./static/api";

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-leaflet/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

exports.onPreInit = (_, pluginOptions, cb) => {
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

  if (fs.existsSync(`${API_PATH}/all.json`)) {
    cb();
    return;
  }

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
  const { createPage } = actions;
  const scraped_data = require(`${API_PATH}/all.json`);

  for (const city of scraped_data.cities) {
    for (const ad_type of scraped_data.ad_types) {
      const slug = `${city.id}/${ad_type.id}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/offers-display.js`),
        context: {
          city,
          ad_type,
          offers: scraped_data.offers[city.id][ad_type.id],
        },
      });
    }
  }
};
