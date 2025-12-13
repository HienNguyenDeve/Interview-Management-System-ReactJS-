import { BaseViewModel } from "./base.view-model";

export abstract class MasterBaseViewModel extends BaseViewModel {
    public insertedAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
}