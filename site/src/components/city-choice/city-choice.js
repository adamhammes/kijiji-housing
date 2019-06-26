import React, { useContext } from "react";

import { Localize, LocalizeLink, LocaleContext, Image } from "../lib";
import IconArrowRight from "heroicons-ui/icons/icon-arrow-right.svg";
import "./city-choice.scss";

const CityChoice = ({ city }) => {
  const locale = useContext(LocaleContext);
  const imageAlt = locale(`cities.${city.id}`);
  return (
    <li className="max-w-md sm:max-w-none mx-auto sm:mx-0 w-full sm:w-1/2 px-2 lg:px-3 mb-8 flex flex-col">
      <Image filename={`${city.id}-cover-16:9.jpg`} alt={imageAlt} />
      <LocalizeLink
        to={`/${city.id}/rent`}
        className="cityChoice inline-block mx-auto mt-6"
      >
        <h2 className="flex items-center">
          <span className="mr-2">
            <Localize>{`cities.${city.id}`}</Localize>
          </span>
          <IconArrowRight className="cityChoice-icon inline h-6 w-6 fill-current stroke-current" />
        </h2>
      </LocalizeLink>
    </li>
  );
};

export default CityChoice;
