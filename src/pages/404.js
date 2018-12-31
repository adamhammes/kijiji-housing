import React from "react";
import { Message, LocalizedLink } from "../components/lib";

const NotFoundPage = () => (
  <>
    <h1>
      <Message>notFound.doesNotExist</Message>
    </h1>
    <LocalizedLink to="/">
      <Message>notFound.returnToHome</Message>
    </LocalizedLink>
  </>
);

export default NotFoundPage;
