import { BaseViewModel } from "../base.view-model";

export class CandidateBaseViewModel extends BaseViewModel implements Record<string, unknown> {
    public fullName!: string;
    public email!: string;
    [key: string]: unknown;
}