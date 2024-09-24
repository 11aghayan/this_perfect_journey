import express from 'express';

import verify_jwt from '@/middleware/verify_jwt';
import { create_admin, delete_admin, get_admin_by_id, get_all_admins, update_admin } from '@/controllers/superuser_controllers';
import { prevent_owner_and_self_delete, check_valid_id } from '@/middleware/check_params';
import { check_username_defined, check_password_defined, check_permission_valid } from '@/middleware/check_body';
import verify_superuser from '@/middleware/verify_superuser';

const superuser_router = express.Router();


superuser_router.get(
  '/all', 
  verify_jwt, 
  verify_superuser, 
  get_all_admins
);

superuser_router.get(
  '/:id', 
  verify_jwt, 
  verify_superuser, 
  check_valid_id, 
  get_admin_by_id
);

superuser_router.post(
  '/create', 
  verify_jwt, 
  verify_superuser, 
  check_username_defined, 
  check_password_defined, 
  check_permission_valid, 
  create_admin
);

superuser_router.put(
  '/update/:id', 
  verify_jwt, 
  verify_superuser, 
  check_valid_id,
  prevent_owner_and_self_delete,
  check_username_defined, 
  check_permission_valid, 
  update_admin
);

superuser_router.delete(
  '/delete/:id',
  verify_jwt,
  verify_superuser,
  check_valid_id,
  prevent_owner_and_self_delete,
  delete_admin
);

export default superuser_router;