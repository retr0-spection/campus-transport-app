import _ from "lodash";
import { useSelector } from "react-redux";

export const deepEqualSelector = (selector) => {
  return useSelector(selector, _.isEqual);
};
