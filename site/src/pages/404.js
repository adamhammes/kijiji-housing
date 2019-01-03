import React from "react";
import { Localize, LocalizeLink } from "../components/lib";

const NotFoundPage = () => (
  <>
    <h1>
      <Localize>notFound.doesNotExist</Localize>
    </h1>
    <LocalizeLink to="/">
      <Localize>notFound.returnToHome</Localize>
    </LocalizeLink>
  </>
);

export default NotFoundPage;
