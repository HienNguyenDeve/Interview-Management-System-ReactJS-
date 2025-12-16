import { InterviewResult } from "../../enums/interview-result.enum";
import { InterviewStatus } from "../../enums/interview-status.enum";
import { SearchFilterViewModel } from "../search-filter.view-model";

export class InterviewSearchViewModel extends SearchFilterViewModel {
    public startDate!: Date | null;
    public endDate!: Date | null;
    public recruiterId!: string;
    public jobId!: string;
    public candidateId!: string;
    public interviewerIds!: string[];
    public status!: InterviewStatus;
    public result!: InterviewResult;

    constructor(init?: Partial<InterviewSearchViewModel>) {
        super();
        Object.assign(this, init);
        this.sortBy = 'title';
    }
}