import { useCallback, useEffect, useState } from "react";
import { UserBaseViewModel } from "../../../view-models/user/user-base.view-model";
import { CandidateBaseViewModel } from "../../../view-models/candidate/candidate-base.view-model";
import { UserService } from "../../../services/user.service";
import { CandidateService } from "../../../services/candidate.service";
import { JobService } from "../../../services/job.service";
import { JobBaseViewModel } from "../../../view-models/job/job-base.view-model";
import { InterviewCreateUpdateViewModel } from "../../../view-models/interview/interview-create-update.view-model";
import moment from "moment";
import { InterviewStatus } from "../../../enums/interview-status.enum";
import { InterviewResult } from "../../../enums/interview-result.enum";
import { FormField } from "../../../shared/components/FormBase";
import * as Yup from "yup";
import { InterviewService } from "../../../services/interview.service";
import { InterviewMasterViewModel } from "../../../view-models/interview/interview-master.view-model";
import { MasterCreateUpdate } from "../MasterCreateUpdate";

export interface InterviewDetails {
    item: InterviewMasterViewModel | null | undefined;
    onCancel: () => void;
}

const InterviewCreateUpdate = (props: InterviewDetails) => {
    // Variables
    const { item, onCancel } = props;
    const [recruiters, setRecruiters] = useState<UserBaseViewModel[] | undefined>([]);
    const [jobs, setJobs] = useState<JobBaseViewModel[]>([]);
    const [candidates, setCandidates] = useState<CandidateBaseViewModel[]>([]);
    const [interviewers, setInterviewers] = useState<UserBaseViewModel[] | undefined>([]);

    // fetch data
    const getRecruiters = useCallback(async () => {
        const response = await UserService.getAll();
        if (response) {
            setRecruiters(response);
        }
    }, [])

    const getInterviewers = useCallback(async () => {
        const response = await UserService.getAll();
        if (response) {
            setInterviewers(response);
        }
    }, [])

    const getCandidates = useCallback(async () => {
        const response = await CandidateService.getAll();
        if (response) {
            setCandidates(response);
        }
    }, [])

    const getJobs = useCallback(async () => {
        const response = await JobService.getAll();
        if (response) {
            setJobs(response);
        }
    }, [])

    useEffect(() => {
        Promise.resolve().then(() => {
            getRecruiters();
            getInterviewers();
            getCandidates();
            getJobs();
        })
    }, [getRecruiters, getInterviewers, getCandidates, getJobs]);

    // initial values
    const initialValues: InterviewCreateUpdateViewModel = {
        title: item ? item.title : '',
        note: item ? item.note : '',
        location: item ? item.location : '',
        meetingId: item ? item.meetingId : '',
        interviewDate: item ? moment(item.startDate).format('YYYY-MM-DD') : null,
        startTime: item ? moment(item.startDate).format('HH:mm') : '',
        endTime: item ? moment(item.endDate).format('HH:mm') : '',
        status: item ? item.status : InterviewStatus.DRAFT,
        result: item ? item.result : InterviewResult.PENDING,
        recruiterId: item ? item.recruiter.id : '',
        jobId: item ? item.job.id : '',
        candidateId: item ? item.candidate.id : '',
        interviewerIds: item ? item.interviewers.map(interviewer => interviewer.id) : [],
    };

    // Validation
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        recruiterId: Yup.string().required("Recruiter is required"),
        candidateId: Yup.string().required("Candidate is required"),
        jobId: Yup.string().required("Job is required"),
        interviewerIds: Yup.array().min(1, "At least one interviewer is required"),
        interviewDate: Yup.date().required("Interview date is required"),
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string().required("End time is required"),
        location: Yup.string().required("Location is required"),
        meetingId: Yup.string().required("Meeting ID is required"),
        status: Yup.string().required("Status is required"),
        result: Yup.string().required("Result is required"),
        note: Yup.string().required("Note is required"),
    });

    // fields
    const fields: FormField[] = [
        { name: 'title', label: 'Title' },
        { name: 'note', label: 'Note' },
        { name: 'location', label: 'Location' },
        { name: 'meetingId', label: 'MeetingId' },
        { name: 'interviewDate', label: 'Interview Date', type: 'date' },
        { name: 'startTime', label: 'Start Time', type: 'time' },
        { name: 'endTime', label: 'End Time', type: 'time' },
        {
            name: 'status',
            label: 'Status',
            as: 'select',
            options: Object.values(InterviewStatus).map(status => ({ label: status, value: status }))
        },
        {
            name: 'result',
            label: 'Result',
            as: 'select',
            options: Object.values(InterviewResult).map(result => ({ label: result, value: result }))
        },
        {
            name: 'recruiterId',
            label: 'recruiterId',
            as: 'select',
            options: recruiters?.map(recruiter => ({ label: recruiter.fullName, value: recruiter.id }))
        },
        {
            name: 'jobId',
            label: 'JobId',
            as: 'select',
            options: jobs.map(job => ({ label: job.title, value: job.id })),
        },
        {
            name: 'candidateId',
            label: 'CandidateId',
            as: 'select',
            options: candidates.map(candidate => ({ label: candidate.fullName, value: candidate.id }))
        },
        {
            name: 'interviewerIds',
            label: 'InterviewerIds',
            as: 'select',
            multiple: true,
            options: interviewers?.map(interviewer => ({ label: interviewer.fullName, value: interviewer.id }))
        }
    ]

    // Submit
    const onSubmit = async (values: InterviewCreateUpdateViewModel) => {
        if (values.startTime && values.endTime && values.interviewDate) {
            const startDate = new Date(values.interviewDate);
            startDate.setHours(parseInt(values.startTime.split(':')[0]), parseInt(values.startTime.split(':')[1]));

            const endDate = new Date(values.interviewDate);
            endDate.setHours(parseInt(values.endTime.split(':')[0]), parseInt(values.endTime.split(':')[1]));

            Object.assign(values, { startDate, endDate });
        }
        if (item) {
            const response = await InterviewService.update(item.id, values);
            if (response) {
                onCancel();
            }
        } else {
            const response = await InterviewService.create(values);
            if (response) {
                onCancel();
            }
        }
    }

    // return
    return (
        <MasterCreateUpdate<InterviewCreateUpdateViewModel>
            title={item ? 'Edit Interview' : 'Create interview'}
            initialValues={initialValues}
            validationSchema={validationSchema}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        >

        </MasterCreateUpdate>
    )
}

export default InterviewCreateUpdate;