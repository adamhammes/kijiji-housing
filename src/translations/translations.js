const fs = require("fs");

const languages = ["fr", "en"];

const locales = {};
for (const lang of languages) {
  const filePath = `src/translations/translations.${lang}.json`;
  const locale = JSON.parse(fs.readFileSync(filePath));

  locales[lang] = locale;
}

module.exports = { languages, locales };
