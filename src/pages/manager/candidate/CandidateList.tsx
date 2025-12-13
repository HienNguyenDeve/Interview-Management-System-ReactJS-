import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MasterList, MasterListHandle } from "../MasterList"
import { CandidateMasterViewModel } from "../../../view-models/candidate/candidate-master.view-model"
import { SkillViewModel } from "../../../view-models/skill/skill.view-model";
import { PositionSerivce } from "../../../services/position.service";
import { PositionBaseViewMovel } from "../../../view-models/position/position-base.view-model";
import { SkillService } from "../../../services/skill.service";
import { UserService } from "../../../services/user.service";
import { UserBaseViewModel } from "../../../view-models/user/user-base.view-model";
import { CandidateSearchViewModel } from "../../../view-models/candidate/candidate-search.view-model";
import * as Yup from 'yup';
import { FormField } from "../../../shared/components/FormBase";
import { EnumHelper } from "../../../helpers/enum.helper";
import { GenderEnum } from "../../../enums/gender.enum";
import { CandidateService } from "../../../services/candidate.service";
import { TableColumnModel } from "../../../models/table-column.model";
import { faClose, faDownload, faEdit, faEye, faSortAmountAsc, faSortAmountDesc, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CandidateCreateUpdateComponent from "./CandidateCreateUpdate";
import { Modal } from "../../../core/components/modals/Modal";
import { ModalType } from "../../../enums/modal-type.enum";
import { ModalSize } from "../../../enums/modal-size.enum";
import { getHighestLevelLabel, HighestLevelEnum } from "../../../enums/highest-level.enum";
import { CandidateStatus, getCandidateStatusLabel } from "../../../enums/candidate-status.enum";

const CandidateList = () => {
    const masterListRef = useRef<MasterListHandle<CandidateMasterViewModel>>(null);
    const [positions, setPositions] = useState<PositionBaseViewMovel[]>([]);
    const [skills, setSkills] = useState<SkillViewModel[]>([]);
    const [recruiters, setRecruiters] = useState<UserBaseViewModel[]>([]);
    const [selectedCV, setSelectedCV] = useState<string>('');
    const [isCVModalOpen, setIsCVModalOpen] = useState(false);

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

    const getRecruiters = useCallback(async () => {
        const response = await UserService.getAll();
        if (response) {
            setRecruiters(response);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            getPositions();
            getSkills();
            getRecruiters();
        })
    }, [getPositions, getSkills, getRecruiters]);

    // initial param filter
    const initialFilter = useMemo(() => new CandidateSearchViewModel(
        {
            keyword: '',
            positionId: '',
            recruiterId: '',
            skillIds: [],
            gender: null,
            active: true, // tại sao lại là active chứ không phải isActive
        }
    ), []);

    const validationSchema = Yup.object({
        keyword: Yup.string().nullable(),
        positionId: Yup.string().nullable(),
        recruiterId: Yup.string().nullable(),
        skillIds: Yup.array().of(Yup.string()).nullable(),
        gender: Yup.boolean().optional().nullable(),
        isActive: Yup.boolean(),
    })

    // initial form fields
    const fields: FormField[] = [
        { name: 'keyword', label: 'Keyword', type: 'text' },
        {
            id: 'search-position',
            name: 'positionId',
            label: 'Position',
            as: 'select',
            options: positions.map(position => ({ label: position.title, value: position.id })),
        },
        {
            id: 'search-recruiter',
            name: 'recruiterId',
            label: 'Recruiter',
            as: 'select',
            options: recruiters.map(recruiter => ({ label: recruiter.fullName, value: recruiter.id })),
        },
        {
            id: 'search-skills',
            name: 'skillIds',
            label: 'Skills',
            as: 'select',
            multiple: true,
            options: skills.map(skill => ({ label: skill.name, value: skill.id }))
        },
        {
            id: 'search-yearsOfExperience',
            name: 'yearsOfExperience',
            label: 'Year of experience',
            type: 'number',
        },
        {
            id: 'search-highest-level',
            name: 'highestLevel',
            label: 'Highest Level',
            as: 'select',
            options: Object.values(HighestLevelEnum)
                .map(level => ({label: getHighestLevelLabel(level), value: level}))
        },
        {
            id: 'search-status',
            name: 'candidateStatus',
            label: 'Status',
            as: 'select',
            options: Object.values(CandidateStatus)
                .map(status => ({label: getCandidateStatusLabel(status), value: status}))
        },
        {
            id: 'search-gender',
            name: 'gender',
            label: 'Gender',
            as: 'select',
            options: [
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Male), value: true },
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Female), value: false },
            ],
        },
        { name: 'isActive', label: 'Active', type: 'checkbox' },
    ]

    const fetchData = useCallback(async (filter: CandidateSearchViewModel) => {
        try {
            const response = await CandidateService.search(filter);
            return response;
        } catch (error) {
            console.error('Error fetching candidates', error);
            return undefined;
        }
    }, []);

    const onEdit = useCallback((item: CandidateMasterViewModel) => {
        masterListRef.current?.onEdit(item);
    }, []);

    const onDelete = useCallback(async (item: CandidateMasterViewModel) => {
        const response = await CandidateService.remove(item.id);
        if (response) {
            masterListRef.current?.refresh();
        }
    }, [masterListRef]);

    const onOpenCV = useCallback(async (item: CandidateMasterViewModel) => {
        setSelectedCV(item.cv);
        setIsCVModalOpen(true);
    }, []);

    const handCloseModal = () => {
        setIsCVModalOpen(false);
        setSelectedCV('');
    }

    const columns = [
        new TableColumnModel<CandidateMasterViewModel>({ field: 'fullName', label: 'FullName' }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'email', label: 'Email',
            iconASC: faSortAmountAsc, iconDESC: faSortAmountDesc
        }),
        new TableColumnModel<CandidateMasterViewModel>({ field: 'phoneNumber', label: 'PhoneNumber' }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'gender',
            label: 'Gender',
            render: (item: CandidateMasterViewModel) => {
                return (
                    <span>
                        {item.gender ? EnumHelper.getDisplayValue(EnumHelper, GenderEnum.Male)
                            : EnumHelper.getDisplayValue(EnumHelper, GenderEnum.Female)}
                    </span>
                )
            }
        }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'position', label: 'Position',
            render: (item: CandidateMasterViewModel) => {
                return (
                    <span>{item.position?.title}</span>
                )
            }
        }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'recruiter', label: 'Recruiter',
            render: (item: CandidateMasterViewModel) => (
                <span>{item.recruiter?.fullName}</span>
            )
        }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'skills', label: 'Skill',
            render: (item: CandidateMasterViewModel) => (
                <span>
                    {item.skills?.map(skill => skill.name).join(', ')}
                </span>
            )
        }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'isActive', label: 'Active',
            render: (item: CandidateMasterViewModel) => (
                <span>{item.isActive ? 'Active' : 'InActive'}</span>
            )
        }),
        new TableColumnModel<CandidateMasterViewModel>({
            field: 'actions', label: 'Actions',
            render: (item: CandidateMasterViewModel) => (
                <div className="flex justify-center items-center space-x-3">
                    <button type="button" title="View" onClick={() => onOpenCV(item)}>
                        <FontAwesomeIcon icon={faEye} className=""></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Edit" onClick={() => onEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} className=""></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Delete" onClick={() => onDelete(item)}>
                        <FontAwesomeIcon icon={faTrash} className=""></FontAwesomeIcon>
                    </button>
                </div>
            )
        }),
    ]

    return (
        <>
            <MasterList<CandidateMasterViewModel, CandidateSearchViewModel>
                ref={masterListRef}
                fetchData={fetchData}
                columns={columns}
                sortBy="fullName"
                initialFilter={initialFilter}
                validationSchema={validationSchema}
                searchFields={fields}
                EntityCreateUpdateComponent={CandidateCreateUpdateComponent}
                title="CandidateList"
                pageSizeList={[5, 10, 20, 50, 100]}
            ></MasterList>
            {selectedCV && (
                <Modal
                    isOpen={isCVModalOpen}
                    title="Candidate CV"
                    modalType={ModalType.INFO}
                    modalSize={ModalSize.SMALL}
                    onClose={handCloseModal}
                    footer={(
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => window.open(selectedCV, '_blank')}
                                className="p-2 px-4 bg-green-500 text-white hover:bg-green-700 rounded-full"
                            >
                                <FontAwesomeIcon icon={faDownload} className="mr-2"></FontAwesomeIcon>
                                Download
                            </button>
                            <button type="button" onClick={handCloseModal} className="p-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded-full">
                                <FontAwesomeIcon icon={faClose} className="mr-2"></FontAwesomeIcon>
                                Close
                            </button>
                        </div>
                    )}
                >
                    <div>
                        <iframe src={selectedCV} className="w-full h-full overflow-y-auto" title="Candidate CV"></iframe>
                    </div>
                </Modal>
            )}
        </>
    );

};

export default CandidateList;