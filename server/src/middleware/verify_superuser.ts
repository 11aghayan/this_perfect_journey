import Db, { Db_no_data } from "@/db";
import { T_Controller } from "@/types";
import { custom_error } from "@/util/errors";


const verify_superuser: T_Controller = async (req, res, next) => {
  const { jwt_username: username } = req.body;

  const admin = await Db.admin.get_by_username(username);
  if (admin instanceof Db_no_data || admin.permission !== 's') return custom_error(res, 403);

  next();
};

export default verify_superuser;