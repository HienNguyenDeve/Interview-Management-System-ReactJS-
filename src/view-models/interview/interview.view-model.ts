import { InterviewResult } from "../../enums/interview-result.enum";
import { InterviewStatus } from "../../enums/interview-status.enum";
import { BaseViewModel } from "../base.view-model";
import { CandidateMasterViewModel } from "../candidate/candidate-master.view-model";
import { JobViewModel } from "../job/job.view-model";
import { RecruiterViewModel } from "../user/recruiter.view-model";
import { UserBaseViewModel } from "../user/user-base.view-model";

export class InterviewViewModel extends BaseViewModel {
    public title!: string;
    public note!: string;
    public location!: string;
    public meetingId!: string;
    public startDate!: Date;
    public endDate!: Date;
    public status!: InterviewStatus;
    public result!: InterviewResult;
    public recruiter!: RecruiterViewModel;
    public job!: JobViewModel;
    public candidate!: CandidateMasterViewModel;
    public interviews!: UserBaseViewModel[];
}