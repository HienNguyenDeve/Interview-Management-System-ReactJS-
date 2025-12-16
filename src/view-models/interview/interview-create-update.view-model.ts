import { FormikValues } from "formik";
import { InterviewResult } from "../../enums/interview-result.enum";
import { InterviewStatus } from "../../enums/interview-status.enum";

export interface InterviewCreateUpdateViewModel extends FormikValues{
    title: string;
    note: string;
    location: string;
    meetingId: string;
    interviewDate: string | null;
    startTime?: string;
    endTime?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    status: InterviewStatus;
    result: InterviewResult;
    recruiterId: string;
    jobId: string;
    candidateId: string;
    interviewerIds: string[];
}