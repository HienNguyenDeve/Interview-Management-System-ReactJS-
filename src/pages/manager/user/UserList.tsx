import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DepartmentBaseViewModel } from "../../../view-models/department/department-base.view-model"
import { RoleBaseViewModel } from "../../../view-models/role/role-base.view-model";
import { UserMasterViewModel } from "../../../view-models/user/user-master.view-model";
import { UserSearchViewModel } from "../../../view-models/user/user-search.view-model";
import * as Yup from 'yup';
import { MasterList, MasterListHandle } from "../MasterList";
import { DepartmentService } from "../../../services/department.service";
import { RoleService } from "../../../services/role.service";
import { FormField } from "../../../shared/components/FormBase";
import { EnumHelper } from "../../../helpers/enum.helper";
import { toggleActiveStatus, UserService } from "../../../services/user.service";
import { TableColumnModel } from "../../../models/table-column.model";
import { faBan, faEdit, faEye, faInfo, faSortAmountAsc, faSortAmountDesc, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "../../../core/components/modals/Modal";
import { ModalType } from "../../../enums/modal-type.enum";
import { ModalSize } from "../../../enums/modal-size.enum";
import UserInfo from "./UserInfo";
import UserCreateUpdate from "./UserCreateUpdate";
import { GenderEnum } from "../../../enums/gender.enum";

const UserList = () => {
    const [departments, setDepartments] = useState<DepartmentBaseViewModel[]>([]);
    const [roles, setRoles] = useState<RoleBaseViewModel[]>([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserMasterViewModel | null>(null);
    const masterListRef = useRef<MasterListHandle<UserMasterViewModel>>(null);
    const getDepartments = useCallback(async () => {
        const response = await DepartmentService.getAll();
        if (response) {
            setDepartments(response);
        }
    }, []);

    const getRoles = useCallback(async () => {
        const roles = await RoleService.getAll();
        if (roles) {
            setRoles(roles);
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            getDepartments();
            getRoles();
        })
    }, [getDepartments, getRoles]);

    const initialFilter = useMemo(() => new UserSearchViewModel(
        {
            keyword: '',
            departmentId: '',
            roleIds: [],
            gender: null,
            active: true
        }
    ), []);

    const validationSchema = Yup.object({
        keyword: Yup.string().nullable(),
        departmentId: Yup.string().nullable(),
        roleIds: Yup.array().of(Yup.string()).nullable(),
        gender: Yup.boolean().optional().nullable(),
        active: Yup.boolean()
    });

    const fields: FormField[] = [
        { name: 'keyword', label: 'Keyword', type: 'text' },
        {
            id: 'search-department',
            name: 'departmentId',
            label: 'Department',
            as: 'select',
            options: departments.map(department => ({ label: department.name, value: department.id })),
        },
        {
            id: 'search-roles',
            name: 'roleIds',
            label: 'Roles',
            as: 'select',
            multiple: true,
            options: roles.map(role => ({ label: role.name, value: role.id })),
        },
        {
            id: 'search-gender',
            name: 'gender', label: 'Gender', as: 'select',
            options: [
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Male), value: false },
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Female), value: true },
            ],
        },
        { name: 'active', label: 'Active', type: 'checkbox' }
    ];

    const fetchData = useCallback(async (filter: UserSearchViewModel) => {
        try {
            const response = await UserService.search(filter);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
            return undefined;
        }
    }, []);

    const onEdit = useCallback((item: UserMasterViewModel) => {
        masterListRef.current?.onEdit(item);
    }, []);

    const onDelete = useCallback(async (item: UserMasterViewModel) => {
        const response = await UserService.remove(item.id);
        if (response) {
            masterListRef.current?.refresh();
        }
    }, [masterListRef]);

    const onViewDetail = useCallback((item: UserMasterViewModel) => {
        setSelectedUser(item);
        setIsDetailModalOpen(true);
    }, []);

    const handleToggleActive = async () => {
        if (selectedUser) {
            const response = await toggleActiveStatus(selectedUser.id, !selectedUser.active);
            if (response) {
                masterListRef.current?.refresh();
                setIsDetailModalOpen(false);
            }
        }
    };

    const handCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedUser(null);
    };

    const columns = [
        new TableColumnModel<UserMasterViewModel>({ field: 'username', label: ' Username' }),
        new TableColumnModel<UserMasterViewModel>({ field: 'email', label: ' Email', iconASC: faSortAmountAsc, iconDESC: faSortAmountDesc }),
        new TableColumnModel<UserMasterViewModel>({ field: 'phoneNumber', label: ' Phone Number' }),
        new TableColumnModel<UserMasterViewModel>({
            field: 'gender',
            label: ' Gender',
            render: (item: UserMasterViewModel) => (
                <span>
                    {item.gender ? EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Female) : EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Male)}
                </span>
            )
        }),
        new TableColumnModel<UserMasterViewModel>({
            field: 'department',
            label: ' Department',
            render: (item: UserMasterViewModel) => (
                <span>{item.department?.name}</span>
            )
        }),
        new TableColumnModel<UserMasterViewModel>({
            field: 'roles',
            label: ' Roles',
            render: (item: UserMasterViewModel) => (
                <span>
                    {item.roles?.map(role => role.name).join(', ')}
                </span>
            )
        }),
        new TableColumnModel<UserMasterViewModel>({
            field: 'active',
            label: ' Active',
            render: (item: UserMasterViewModel) => (
                <span>
                    {item.active ? "Active" : "Inactive"}
                </span>
            )
        }),
        new TableColumnModel<UserMasterViewModel>({
            field: 'actions',
            label: ' Actions',
            render: (item: UserMasterViewModel) => (
                <div className="flex justify-center space-x-3">
                    <button type="button" title="View" onClick={() => onViewDetail(item)}>
                        <FontAwesomeIcon icon={faEye} className="text-green-500"></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Edit" onClick={() => onEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500"></FontAwesomeIcon>
                    </button>
                    <button type="button" title="Delete" onClick={() => onDelete(item)}>
                        <FontAwesomeIcon icon={faTrash} className="text-red-500"></FontAwesomeIcon>
                    </button>
                </div>
            )
        }),
    ];

    return (
        <>
            <MasterList<UserMasterViewModel, UserSearchViewModel>
                ref={masterListRef}
                fetchData={fetchData}
                columns={columns}
                sortBy="username"
                initialFilter={initialFilter}
                validationSchema={validationSchema}
                searchFields={fields}
                EntityCreateUpdateComponent={UserCreateUpdate}
                title="User Management"
                pageSizeList={[10, 20, 50, 100]}
            ></MasterList>
            {selectedUser && (
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={handCloseModal}
                    title="User Detail"
                    modalType={ModalType.INFO}
                    modalSize={ModalSize.SMALL}
                    footer={(
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleToggleActive}
                                className="p-2 px-4 bg-yellow-500 text-white hover:bg-yellow-700 rounded-full"
                            >
                                <FontAwesomeIcon icon={faBan} className="mr-2"></FontAwesomeIcon>
                                {selectedUser.active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                                type="button"
                                onClick={handCloseModal}
                                className="p-2 px-4 bg-green-500 text-white hover:bg-gray-700 rounded-full"
                            >
                                <FontAwesomeIcon icon={faInfo} className="mr-2"></FontAwesomeIcon>
                                Ok
                            </button>

                        </div>
                    )}
                >
                    <div className="border-y border-slate-300">
                        <UserInfo user={selectedUser}></UserInfo>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default UserList;
