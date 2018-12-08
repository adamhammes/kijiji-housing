const path = require(`path`);

const scraped_data = require('./out.json');

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

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