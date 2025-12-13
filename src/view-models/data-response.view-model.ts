import { PageInfoModel } from "../models/page-infor.model";

export class DataResponseViewModel<T>{
    public data!: T;
    public page!: PageInfoModel;
}