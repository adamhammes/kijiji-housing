import React, { useContext } from "react";

import { Localize, LocalizeLink, LocaleContext, Image } from "../lib";
import IconArrowRight from "heroicons-ui/icons/icon-arrow-right.svg";
import "./city-choice.scss";

const CityChoice = ({ city }) => {
  const locale = useContext(LocaleContext);
  const imageAlt = locale(`cities.${city.id}`);
  return (
    <li className="max-w-md sm:max-w-none mx-auto sm:mx-0 sm:w-1/2 px-2 lg:px-3 mb-8">
      <LocalizeLink
        to={`/${city.id}/rent`}
        className="cityChoice block no-underline cursor-pointer"
      >
        <Image filename={`${city.id}-cover-16:9.jpg`} alt={imageAlt} />
        <h2 className="flex justify-center items-center">
          <span className="mr-2">
            <Localize>{`cities.${city.id}`}</Localize>
          </span>
          <IconArrowRight className="cityChoice-icon inline h-8 w-8 fill-current stroke-current" />
        </h2>
      </LocalizeLink>
    </li>
  );
};

export default CityChoice;
