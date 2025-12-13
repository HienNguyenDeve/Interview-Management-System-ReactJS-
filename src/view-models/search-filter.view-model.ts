import { FormikValues } from "formik";
import { OrderDirectionEnum } from "../enums/order-direction.enum";

export class SearchFilterViewModel implements FormikValues {
    public keyword: string = '';
    public page: number = 0;
    public size: number = 10;
    public sortBy!: string;
    public order: OrderDirectionEnum = OrderDirectionEnum.ASC;
}