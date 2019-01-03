import galite from "ga-lite";

const onClientEntry = () => {
  galite("create", "UA-113910402-1", "auto");
  galite("set", "anonymizeIp", true);
  galite("send", "pageview");
};

const onRouteUpdate = ({ location }) => {
  galite("set", "page", location.pathname + location.search + location.hash);
  galite("send", "pageview");
};

export { onClientEntry, onRouteUpdate };
export { wrapPageElement } from "./src/components/locale-context";
