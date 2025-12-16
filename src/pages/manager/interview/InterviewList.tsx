import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as Yup from "yup";
import { FormField } from "../../../shared/components/FormBase";
import { UserBaseViewModel } from "../../../view-models/user/user-base.view-model";
import { JobBaseViewModel } from "../../../view-models/job/job-base.view-model";
import { CandidateBaseViewModel } from "../../../view-models/candidate/candidate-base.view-model";
import { UserService } from "../../../services/user.service";
import { JobService } from "../../../services/job.service";
import { CandidateService } from "../../../services/candidate.service";
import { InterviewService } from "../../../services/interview.service";
import { InterviewSearchViewModel } from "../../../view-models/interview/interview-search.view-model";
import { MasterList, MasterListHandle } from "../MasterList";
import { InterviewMasterViewModel } from "../../../view-models/interview/interview-master.view-model";
import { TableColumnModel } from "../../../models/table-column.model";
import InterviewCreateUpdate from "./InterviewCreateUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const InterviewList = () => {
    // variables
    const [recruiters, setRecruiters] = useState<UserBaseViewModel[]>([]);
    const [jobs, setJobs] = useState<JobBaseViewModel[]>([]);
    const [candidates, setCandidates] = useState<CandidateBaseViewModel[]>([]);
    const [interviewers, setInterviewers] = useState<UserBaseViewModel[]>([]);
    const masterListRef = useRef<MasterListHandle<InterviewMasterViewModel>>(null);

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

    const getJobs = useCallback(async () => {
        const response = await JobService.getAll();
        if (response) {
            setJobs(response);
        }
    }, [])

    const getCandidates = useCallback(async () => {
        const response = await CandidateService.getAll();
        if (response) {
            setCandidates(response);
        }
    }, [])

    const fetchData = useCallback(async (values: InterviewSearchViewModel) => {
        try {
            const response = await InterviewService.search(values);
            return response;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }, [])

    const onEdit = useCallback((item: InterviewMasterViewModel) => {
        masterListRef.current?.onEdit(item);
    }, []);

    const onDelete = useCallback(async (item: InterviewMasterViewModel) => {
        const response = await InterviewService.remove(item.id);
        if (response) {
            masterListRef.current?.refresh();
        }
    }, [masterListRef]);

    useEffect(() => {
        Promise.resolve().then(() => {
            getRecruiters();
            getInterviewers();
            getJobs();
            getCandidates();
        })
    }, [getRecruiters, getInterviewers, getJobs, getCandidates])

    // initial filter
    const initialFilter = useMemo(() => new InterviewSearchViewModel(
        {
            keyword: '',
            startDate: null,
            endDate: null,
            recruiterId: '',
            jobId: '',
            candidateId: '',
            interviewerIds: [],
        }
    ), [])

    // validations
    const validationSchema = Yup.object({
        keyword: Yup.string(),
        candidateId: Yup.string().nullable(),
        recruiterId: Yup.string().nullable(),
        jobId: Yup.string().nullable(),
        interviewerIds: Yup.array(),
        interviewDate: Yup.date().nullable(),
        startTime: Yup.string(),
        endTime: Yup.string(),
    });

    // search fields
    const searchFields: FormField[] = [
        { name: 'keyword', label: 'Keyword' },
        { name: 'startDate', label: 'Start Date', type: 'date' },
        { name: 'endDate', label: 'End Date', type: 'date' },
        {
            name: 'recruiterId',
            label: 'Recruiter',
            as: 'select',
            options: recruiters.map(recruiter => ({ label: recruiter.fullName, value: recruiter.id }))
        },
        {
            name: 'jobId',
            label: 'Job',
            as: 'select',
            options: jobs.map(job => ({ label: job.title, value: job.id }))
        },
        {
            name: 'candidateId',
            label: 'Candidate',
            as: 'select',
            options: candidates.map(candidate => ({ label: candidate.fullName, value: candidate.id }))
        },
        {
            name: 'interviewerIds',
            label: 'Interviewer',
            as: 'select',
            multiple: true,
            options: interviewers.map(interviewer => ({ label: interviewer.fullName, value: interviewer.id }))
        },
    ]

    // columns
    const columns: TableColumnModel<InterviewMasterViewModel>[] = [
        { field: 'title', label: 'Title' },
        { field: 'location', label: 'Location' },
        { field: 'meetingId', label: 'MeetingId' },
        { field: 'startDate', label: 'Start Date' },
        { field: 'endDate', label: 'End Date' },
        { field: 'status', label: 'Status' },
        { field: 'result', label: 'Result' },
        { field: 'recruiter', label: 'Recruiter' },
        { field: 'candidate', label: 'Candidate' },
        { field: 'job', label: 'Job' },
        { field: 'interviewers', label: 'Interviewers' },
        {
            field: 'actions',
            label: ' Actions',
            render: (item: InterviewMasterViewModel) => (
                <div className="flex justify-center space-x-3">
                    <button type="button" title="Edit" onClick={() => onEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500"></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Delete" onClick={() => onDelete(item)}>
                        <FontAwesomeIcon icon={faTrash} className="text-red-500"></FontAwesomeIcon>
                    </button>
                </div>
            )
        }
    ]

    // return
    return (
        <MasterList<InterviewMasterViewModel, InterviewSearchViewModel>
            ref={masterListRef}
            title="Interview List"
            columns={columns}
            sortBy="title"
            initialFilter={initialFilter}
            validationSchema={validationSchema}
            searchFields={searchFields}
            EntityCreateUpdateComponent={InterviewCreateUpdate}
            pageSizeList={[5, 10, 20, 50, 100]}
            fetchData={fetchData}
        ></MasterList>
    )

}

export default InterviewList;