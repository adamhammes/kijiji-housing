import galite from "ga-lite";

const onClientEntry = () => {
  galite("create", "UA-113910402-1", "auto");
  galite("send", "pagview");
};

export { onClientEntry };
export { wrapPageElement } from "./src/components/locale-context";
