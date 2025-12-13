import { RoleBaseViewModel } from "../view-models/role/role-base.view-model";
import { RoleViewModel } from "../view-models/role/RoleViewModel";
import { BaseService } from "./base.service";

const RoleService = BaseService<RoleBaseViewModel, RoleViewModel, any, any, any>('roles');

export { RoleService };