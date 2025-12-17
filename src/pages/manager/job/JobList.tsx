import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MasterList, MasterListHandle } from "../MasterList"
import { JobMasterViewModel } from "../../../view-models/job/job-master.view-model"
import { SkillBaseViewModel } from "../../../view-models/skill/skill-base.view-model";
import { BenefitBaseViewModel } from "../../../view-models/benefit/benefit-base.view-model";
import { LevelBaseViewModel } from "../../../view-models/level/level-base.view-model";
import { BenefitService } from "../../../services/benefit.service";
import { LevelService } from "../../../services/level.service";
import { SkillService } from "../../../services/skill.service";
import { JobSearchViewModel } from "../../../view-models/job/job-search.view-model";
import moment from "moment";
import { JobStatus } from "../../../enums/job-status.enum";
import { TableColumnModel } from "../../../models/table-column.model";
import * as Yup from 'yup';
import { FormField } from "../../../shared/components/FormBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEdit, faEye, faSortAlphaAsc, faSortAlphaDesc, faTrash } from "@fortawesome/free-solid-svg-icons";
import { JobService } from "../../../services/job.service";
import { JobCreateUpdate } from "./JobCreateUpdate";
import { Modal } from "../../../core/components/modals/Modal";
import { ModalSize } from "../../../enums/modal-size.enum";
import { ModalType } from "../../../enums/modal-type.enum";

export const JobList = () => {
    // variables
    const masterListRef = useRef<MasterListHandle<JobMasterViewModel>>(null);
    const [skills, setSkills] = useState<SkillBaseViewModel[]>([]);
    const [benefits, setBenefits] = useState<BenefitBaseViewModel[]>([]);
    const [levels, setLevels] = useState<LevelBaseViewModel[]>([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    // fetchData
    const getSkills = useCallback(async () => {
        const response = await SkillService.getAll();
        if (response) {
            setSkills(response);
        }
    }, []);

    const getBenefits = useCallback(async () => {
        const response = await BenefitService.getAll();
        if (response) {
            setBenefits(response);
        }
    }, []);

    const getLevels = useCallback(async () => {
        const response = await LevelService.getAll();
        if (response) {
            setLevels(response);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            getSkills();
            getBenefits();
            getLevels();
        })
    }, [getSkills, getBenefits, getLevels])

    const fetchData = useCallback(async (filter: JobSearchViewModel) => {
        try {
            const response = await JobService.search(filter);
            return response;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }, [])

    // initial Filter
    const initialValues = useMemo(() => new JobSearchViewModel(
        {
            keyword: '',
            startDate: null,
            endDate: null,
            salaryFrom: 0,
            salaryTo: 0,
            status: JobStatus.ALL,
            skillIds: [],
            benefitIds: [],
            levelIds: [],
        }
    ), [])

    // validations
    const validationSchema = Yup.object({
        title: Yup.string(),
        skillIds: Yup.array().of(Yup.string()),
        startDate: Yup.date().nullable(),
        endDate: Yup.date().nullable(),
        salaryFrom: Yup.number().nullable().min(0),
        salaryTo: Yup.number().nullable().min(Yup.ref('salaryFrom')),
        benefitIds: Yup.array().of(Yup.string()),
        levelIds: Yup.array().of(Yup.string()),
        status: Yup.string().oneOf([JobStatus.ALL, JobStatus.DRAFT, JobStatus.OPEN, JobStatus.CLOSED, JobStatus.CANCELLED])
    })

    // searchFields
    const searchFields: FormField[] = [
        { name: 'keyword', label: 'Keyword', type: 'text', className: 'w-full md:w-1/2' },
        {
            name: 'skillIds',
            label: 'Skills',
            as: 'select',
            multiple: true,
            options: skills.map((s) => ({ label: s.name, value: s.id })),
            className: 'w-full md:w-1/2'
        },
        { name: 'startDate', label: 'Start Date', type: 'date', className: 'w-full md:w-1/2' },
        { name: 'endDate', label: 'End Date', type: 'date', className: 'w-full md:w-1/2' },
        { name: 'salaryFrom', label: 'Salary From', type: 'number', className: 'w-full md:w-1/2' },
        { name: 'salaryTo', label: 'Salary To', type: 'number', className: 'w-full md:w-1/2' },
        {
            name: 'benefitIds',
            label: 'Benefits',
            as: 'select',
            multiple: true,
            options: benefits.map((b) => ({ label: b.title, value: b.id })),
            className: 'w-full md:w-1/2'
        },
        {
            name: 'levelIds',
            label: 'Levels',
            as: 'select',
            multiple: true,
            options: levels.map((l) => ({ label: l.title, value: l.id })),
            className: 'w-full md:w-1/2'
        },
        {
            name: 'status',
            label: 'Status',
            as: 'select',
            options: [
                ...Object.values(JobStatus).map((s) => ({ label: s, value: s }))
            ],
            className: 'w-full md:w-1/2'
        }
    ]

    // columns
    const columns: TableColumnModel<JobMasterViewModel>[] = [
        { field: 'title', label: 'Title' },
        {
            field: 'startDate', label: 'Start Date', iconASC: faSortAlphaAsc, iconDESC: faSortAlphaDesc,
            render: (item) => (
                <span>{item.startDate ? moment(item.startDate).format('YYYY-MM-DD') : ''}</span>
            )
        },
        {
            field: 'endDate', label: 'End Date', iconASC: faSortAlphaAsc, iconDESC: faSortAlphaDesc,
            render: (item) => (
                <span>{item.endDate ? moment(item.endDate).format('YYYY-MM-DD') : ''}</span>
            )
        },
        { field: 'workingAddress', label: 'Working Address' },
        { field: 'salaryFrom', label: 'Salary From' },
        { field: 'salaryTo', label: 'Salary To' },
        { field: 'status', label: 'Status' },
        {
            field: 'skills', label: 'Skills', render: (item) => (
                <span>{item.skills.map(s => s.name).join(', ')}</span>
            )
        },
        {
            field: 'benefits', label: 'Benefits', render: (item) => (
                <span>{item.benefits.map(b => b.title).join(', ')}</span>
            )
        },
        {
            field: 'levels', label: 'Levels', render: (item) => (
                <span>{item.levels?.map(level => level.title).join(', ')}</span>
            )
        },
        {
            field: 'actions', label: 'Actions', render: (item: JobMasterViewModel) => (
                <div className="flex justify-end space-x-3">
                    <button type="button" title="View detail" onClick={() => onViewDetail(item)}>
                        <FontAwesomeIcon icon={faEye} className="text-blue-500"></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Edit" onClick={() => onEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} className="text-black-500"></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Delete" onClick={() => onDelete(item)}>
                        <FontAwesomeIcon icon={faTrash} className="text-red-500"></FontAwesomeIcon>
                    </button>
                </div>
            )
        },
    ]

    // ref
    const onEdit = useCallback((item: JobMasterViewModel) => {
        masterListRef.current?.onEdit(item);
    }, []);

    const onDelete = useCallback(async (item: JobMasterViewModel) => {
        const response = await JobService.remove(item.id);
        if (response) {
            masterListRef.current?.refresh();
        }
    }, [masterListRef]);

    // view Detail
    const onViewDetail = useCallback((item: JobMasterViewModel) => {
        setSelectedJob(item.description);
        setIsDetailModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setSelectedJob(null);
        setIsDetailModalOpen(false);
    }

    // return
    return (
        <>
            <MasterList<JobMasterViewModel, JobSearchViewModel>
                title="Job Management"
                sortBy="title"
                columns={columns}
                initialFilter={initialValues}
                validationSchema={validationSchema}
                fetchData={fetchData}
                EntityCreateUpdateComponent={JobCreateUpdate}
                searchFields={searchFields}
                pageSizeList={[5, 10, 20, 50, 100]}
                ref={masterListRef}
            ></MasterList>
            {selectedJob && (
                <Modal
                    title="Job description"
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseModal}
                    modalSize={ModalSize.SMALL}
                    modalType={ModalType.INFO}
                    footer={(
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={handleCloseModal} 
                                className="p-2 px-4 bg-blue-500 text-white
                                    hover:bg-blue-700 rounded-full">
                                <FontAwesomeIcon icon={faClose} className="mr-2"></FontAwesomeIcon>
                                Close
                            </button>
                        </div>
                    )}
                >
                    <div className="p-4">
                        {selectedJob}
                    </div>
                </Modal>
            )}
        </>
    )
}