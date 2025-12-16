import { JobStatus } from "../../enums/job-status.enum";
import { BaseViewModel } from "../base.view-model";

export class JobViewModel extends BaseViewModel{
    public title!: string;
    public skills!: string[];
    public startDate!: string;
    public endDate!: string;
    public salaryFrom!: number;
    public salaryTo!: number;
    public benefits!: string[];
    public workingAddress!: string;
    public levels!: string[];
    public description!: string;
    public status!: JobStatus;
}