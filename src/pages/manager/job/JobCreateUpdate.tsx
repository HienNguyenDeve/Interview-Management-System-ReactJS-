import { useCallback, useEffect, useState } from "react";
import { JobMasterViewModel } from "../../../view-models/job/job-master.view-model"
import { SkillBaseViewModel } from "../../../view-models/skill/skill-base.view-model";
import { BenefitBaseViewModel } from "../../../view-models/benefit/benefit-base.view-model";
import { LevelBaseViewModel } from "../../../view-models/level/level-base.view-model";
import { SkillService } from "../../../services/skill.service";
import { JobCreateUpdateViewModel } from "../../../view-models/job/job-create-update.view-model";
import { JobStatus } from "../../../enums/job-status.enum";
import moment from "moment";
import * as Yup from "yup";
import { FormField } from "../../../shared/components/FormBase";
import { JobService } from "../../../services/job.service";
import { MasterCreateUpdate } from "../MasterCreateUpdate";
import { BenefitService } from "../../../services/benefit.service";
import { LevelService } from "../../../services/level.service";

export interface JobProps {
    item: JobMasterViewModel | null | undefined;
    onCancel: () => void;
}
export const JobCreateUpdate = (props: JobProps) => {
    // variables
    const { item, onCancel } = props;
    const [skills, setSkills] = useState<SkillBaseViewModel[] | undefined>([]);
    const [benefits, setBenefits] = useState<BenefitBaseViewModel[]>([]);
    const [levels, setLevels] = useState<LevelBaseViewModel[]>([]);

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

    // initialValues
    const initialValues: JobCreateUpdateViewModel = {
        title: item ? item.title : '',
        startDate: item ? moment(item.startDate).format('YYYY-MM-DD') : '',
        endDate: item ? moment(item.endDate).format('YYYY-MM-DD') : '',
        workingAddress: item ? item.workingAddress : '',
        description: item ? item.description : '',
        salaryFrom: item ? item.salaryFrom : 0,
        salaryTo: item ? item.salaryTo : 0,
        status: item ? item.status : JobStatus.DRAFT,
        skillIds: item ? item.skills.map(skill => skill.id) : [],
        benefitIds: item ? item.benefits.map(benefit => benefit.id) : [],
        levelIds: item ? item.levels.map(level => level.id) : [],
    }

    // validations
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        skillIds: Yup.array().of(Yup.string()).min(1, 'Select at least one skill').required('Skills are required'),
        startDate: Yup.date().required('Start Date is required'),
        endDate: Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End Date must be after Start Date'),
        salaryFrom: Yup.number().min(0, 'Salary From must be at least 0').required('Salary From is required'),
        salaryTo: Yup.number().min(Yup.ref('salaryFrom'), 'Salary To must be greater than Salary From').required('Salary To is required'),
        benefitIds: Yup.array().of(Yup.string()),
        workingAddress: Yup.string().required('Working Address is required').max(255),
        levelIds: Yup.array().of(Yup.string()).min(1, 'Select at least one level').required('Levels are required'),
        description: Yup.string().required('Description is required').max(1000),
        status: Yup.string().oneOf(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']).required('Status is required')
    })

    // fields
    const fields: FormField[] = [
        {name: 'title', label: 'Title'},
        {
            name: 'skillIds',
            label: 'Skills',
            as: 'select',
            multiple: true,
            options: skills?.map(skill => ({label: skill.name, value: skill.id}))},
        {name: 'startDate', label: 'Start Date', type: 'date'},
        {name: 'endDate', label: 'End Date', type: 'date'},
        {name: 'salaryForm', label: 'Salary Form', type: 'number'},
        {name: 'salaryTo', label: 'Salary To', type: 'number'},
        {name: 'workingAddress', label: 'Working Address'},
        {name: 'description', label: 'Description'},
        {
            name: 'status',
            label: 'Status',
            as: 'select',
            options: Object.values(JobStatus).map(status => ({label: status, value: status}))},
        {
            name: 'benefitIds',
            label: 'Benefits',
            as: 'select',
            multiple: true,
            options: benefits.map(benefit => ({label: benefit.title, value: benefit.id}))},
        {
            name: 'levelIds',
            label: 'Levels',
            as: 'select',
            multiple: true,
            options: levels.map(level => ({label: level.title, value: level.id}))},
    ]

    // onSubmit
    const onSubmit = async (values: JobCreateUpdateViewModel) => {
        if (item) {
            const response = await JobService.update(item.id, values);
            if (response) {
                onCancel();
            }
        } else {
            const response = await JobService.create(values);
            if (response) {
                onCancel();
            }
        }
    }

    // return
    return (
        <MasterCreateUpdate<JobCreateUpdateViewModel>
            title={item ? 'Edit Job' : 'Add Job'}
            initialValues={initialValues}
            validationSchema={validationSchema}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
        ></MasterCreateUpdate>
    )
}