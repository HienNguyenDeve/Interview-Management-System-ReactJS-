import moment from "moment";
import { FormField } from "../../../shared/components/FormBase";
import { CandidateCreateUpdateViewModel } from "../../../view-models/candidate/candidate-create-update.view-model";
import { CandidateMasterViewModel } from "../../../view-models/candidate/candidate-master.view-model"
import { MasterCreateUpdate } from "../MasterCreateUpdate";
import * as Yup from 'yup';
import { useCallback, useEffect, useState } from "react";
import { PositionBaseViewMovel } from "../../../view-models/position/position-base.view-model";
import { EnumHelper } from "../../../helpers/enum.helper";
import { GenderEnum } from "../../../enums/gender.enum";
import { UserBaseViewModel } from "../../../view-models/user/user-base.view-model";
import { SkillBaseViewModel } from "../../../view-models/skill/skill-base.view-model";
import { UserService } from "../../../services/user.service";
import { PositionSerivce } from "../../../services/position.service";
import { SkillService } from "../../../services/skill.service";
import { CandidateStatus, getCandidateStatusLabel } from "../../../enums/candidate-status.enum";
import { getHighestLevelLabel, HighestLevelEnum } from "../../../enums/highest-level.enum";
import { CandidateService } from "../../../services/candidate.service";

type CandidateDetailProps = {
    readonly item: CandidateMasterViewModel | null | undefined;
    readonly onCancel: () => void;
}

function CandidateCreateUpdateComponent(props: CandidateDetailProps) {
    const { item, onCancel } = props;
    const [positions, setPositions] = useState<PositionBaseViewMovel[]>([]);
    const [recruiters, setRecruiters] = useState<UserBaseViewModel[]>([]);
    const [skills, setSkills] = useState<SkillBaseViewModel[]>([]);

    const getRecruiters = useCallback(async () => {
        const response = await UserService.getAll();
        if (response) {
            setRecruiters(response);
        }
    }, []);
    const getPositions = useCallback(async () => {
        const response = await PositionSerivce.getAll();
        if (response) {
            setPositions(response);
        }
    }, []);
    const getSkills = useCallback(async () => {
        const response = await SkillService.getAll();
        if (response) {
            setSkills(response);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            getRecruiters();
            getPositions();
            getSkills();
        })
    }, [getRecruiters, getPositions, getSkills])

    const initialValues: CandidateCreateUpdateViewModel = {
        fullName: item ? item.fullName : '',
        email: item ? item.email : '',
        phoneNumber: item ? item.phoneNumber : '',
        dateOfBirth: item ? moment(item.dateOfBirth).format('YYYY-MM-DD') : '',
        address: item ? item.address : '',
        note: item ? item.note : '',
        gender: item ? item.gender : true,
        recruiterId: item ? item.recruiter.id : '',
        positionId: item ? item.position.id : '',
        yearsOfExprience: item ? item.yearsOfExprience : 0,
        highestLevel: item ? item.highestLevel : '',
        status: item ? item.status : '',
        cv: item ? item.cv : '',
        skillIds: item ? item.skills.map(skill => skill.id) : [],
    }

    const validationSchema = Yup.object({
        fullName: Yup.string().required(),
        email: Yup.string().email().required(),
        phoneNumber: Yup.string().required(),
        dateOfBirth: Yup.date().required(),
        address: Yup.string().required(),
        note: Yup.string().optional(),
        gender: Yup.boolean().required(),
        recruiterId: Yup.string().required(),
        positionId: Yup.string().required(),
        yearsOfExprience: Yup.number().required(),
        highestLevel: Yup.string().required(),
        status: Yup.string().required(),
        cv: Yup.string().required(),
        skillIds: Yup.array().of(Yup.string()).min(1).required(),
    })

    const fields: FormField[] = [
        { name: 'fullName', label: 'FullName' },
        { name: 'email', label: 'Email' },
        { name: 'phoneNumber', label: 'PhoneNumber' },
        { name: 'dateOfBirth', label: 'DateOfBirth', type: 'date' },
        { name: 'address', label: 'Address' },
        { name: 'note', label: 'Note', as: 'textarea' },
        {
            name: 'gender', label: 'Gender', as: 'select', options: [
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Male), value: true },
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Female), value: false },
            ]
        },
        {
            name: 'recruiterId', label: 'Recruiter', as: 'select',
            options: recruiters.map(recruiter => ({ label: recruiter.fullName, value: recruiter.id }))
        },
        {
            name: 'positionId', label: 'Position', as: 'select',
            options: positions.map(position => ({ label: position.title, value: position.id }))
        },
        { name: 'yearsOfExprience', label: 'YearsOfExprience' },
        {
            name: 'highestLevel',
            label: 'HighestLevel',
            as: 'select',
            options: Object.values(HighestLevelEnum)
                .map(value => ({ label: getHighestLevelLabel(value), value: value }))
        },
        {
            name: 'status',
            label: 'Status',
            as: 'select',
            options: Object.values(CandidateStatus)
                .map(status => ({ label: getCandidateStatusLabel(status), value: status }))
        },
        { name: 'cv', label: 'Cv' },
        {
            name: 'skillIds',
            label: 'Skills',
            as: 'select',
            multiple: true,
            options: skills.map(skill => ({ label: skill.name, value: skill.id }))
        },
    ]

    const onSubmit = async (values: CandidateCreateUpdateViewModel) => {
        if (item) {
            const response = await CandidateService.update(item.id, values);
            if (response) {
                onCancel();
            }
        } else {
            const response = await CandidateService.create(values);
            if (response) {
                onCancel();
            }
        }
    }

    return (
        <MasterCreateUpdate<CandidateCreateUpdateViewModel>
            initialValues={initialValues}
            validationSchema={validationSchema}
            fields={fields}
            title="Candidate Create Update"
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

export default CandidateCreateUpdateComponent;