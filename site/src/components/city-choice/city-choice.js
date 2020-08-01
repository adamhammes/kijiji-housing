import React, { useContext } from "react";

import { Localize, LocalizeLink, LocaleContext, Image } from "../lib";
import IconArrowRight from "heroicons-ui/icons/icon-arrow-right.svg";
import "./city-choice.scss";

const CityChoice = ({ city }) => {
  const locale = useContext(LocaleContext);
  const imageAlt = locale(`cities.${city.short_code}`);

  return (
    <LocalizeLink
      to={`/${city.short_code}/rent`}
      className="max-w-md sm:max-w-none mx-auto sm:mx-0 w-full sm:w-1/2 px-2 lg:px-3 mb-8 flex flex-col shadow-none cityChoice"
    >
      <Image filename={`${city.short_code}-cover-16:9.jpg`} alt={imageAlt} />
      <div className="inline-block mx-auto mt-6">
        <h2 className="cityChoice-link flex items-center mb-0 link">
          <span className="mr-2">
            <Localize>{`cities.${city.short_code}`}</Localize>
          </span>
          <IconArrowRight className="cityChoice-icon inline h-6 w-6 fill-current stroke-current" />
        </h2>
      </div>
    </LocalizeLink>
  );
};

export default CityChoice;
