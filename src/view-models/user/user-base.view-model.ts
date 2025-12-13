import { BaseViewModel } from "../base.view-model";

export class UserBaseViewModel extends BaseViewModel implements Record<string, unknown> {
    public fullName!: string;
    public username!: string;
    public email!: string;
    public phoneNumber!: string;
    [key: string]: unknown;
}