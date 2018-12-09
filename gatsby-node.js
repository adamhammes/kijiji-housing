const fs = require('fs');
const path = require(`path`);

const aws = require('aws-sdk');

const secrets = require('./secrets.json');

const API_PATH = './static/api'

exports.onPreBootstrap = (_, pluginOptions, cb) => {
  aws.config.update({
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
  });

  const s3 = new aws.S3();

  const downloadOptions = {
    Bucket: 'kijiji-apartments',
    Key: 'v2/latest/out.json',
  };

  if (fs.existsSync(`${API_PATH}/all.json`)) {
    cb()
    return;
  }

  console.log('Downloading latest scraped data...');
  s3.getObject(downloadOptions, (err, data) => {
    if (err) {
      console.error(err);
    }
    fs.writeFileSync('static/api/all.json', data.Body);

    const scraped_data = JSON.parse(data.Body);

    for (const city of scraped_data.cities) {
      for (const ad_type of scraped_data.ad_types) {
        const fileName = `${API_PATH}/${city.id}-${ad_type.id}.json`;
        const data = {
          city,
          ad_type,
          offers: scraped_data.offers[city.id][ad_type.id],
        }

        fs.writeFileSync(fileName, JSON.stringify(data));
      }
    }
    cb();
  });
}

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
          offers: scraped_data.offers[city.id][ad_type.id]
        }
      })
    }
  }

}