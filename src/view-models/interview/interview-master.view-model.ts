import { InterviewResult } from "../../enums/interview-result.enum";
import { InterviewStatus } from "../../enums/interview-status.enum";
import { CandidateMasterViewModel } from "../candidate/candidate-master.view-model";
import { JobViewModel } from "../job/job.view-model";
import { MasterBaseViewModel } from "../master-base.view-model";
import { RecruiterViewModel } from "../user/recruiter.view-model";
import { UserBaseViewModel } from "../user/user-base.view-model";

export class InterviewMasterViewModel extends MasterBaseViewModel implements Record<string, unknown>{
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
    public interviewers!: UserBaseViewModel[];
    [key: string]: unknown;
}