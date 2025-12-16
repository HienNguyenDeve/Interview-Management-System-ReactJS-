import { BaseViewModel } from "../base.view-model";

export class InterviewBaseViewModel extends BaseViewModel implements Record<string, unknown>{
    public title!: string;
    public note!: string;
    [key: string]: unknown;
}