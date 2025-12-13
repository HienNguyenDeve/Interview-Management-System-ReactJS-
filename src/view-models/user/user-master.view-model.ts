import { DepartmentViewModel } from "../department/DepartmentViewModel";
import { MasterBaseViewModel } from "../master-base.view-model";
import { RoleViewModel } from "../role/RoleViewModel";

export class UserMasterViewModel extends MasterBaseViewModel implements Record<string, unknown> {
    public fullName!: string;
    public username!: string;
    public email!: string;
    public phoneNumber!: string;
    public dateOfBirth!: string;
    public active!: boolean;
    public gender!: boolean;
    public avatar!: string;
    public address!: string;
    public note!: string;
    public department!: DepartmentViewModel;
    public roles!: RoleViewModel[];
    [key: string]: unknown;
}