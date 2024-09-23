import { T_Controller } from "@/types";
import { custom_error } from "@/util/errors";

const not_found_controller: T_Controller = (_req, res) => {
  return custom_error(res, 404, 'Route not found');
};

export default not_found_controller;