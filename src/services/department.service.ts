import { DepartmentBaseViewModel } from "../view-models/department/department-base.view-model";
import { DepartmentViewModel } from "../view-models/department/DepartmentViewModel";
import { BaseService } from "./base.service";

const DepartmentService = BaseService<DepartmentBaseViewModel, DepartmentViewModel, any, any, any>('departments');

export { DepartmentService };