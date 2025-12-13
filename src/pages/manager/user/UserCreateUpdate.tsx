import React, { useCallback, useEffect, useState } from "react";
import { UserMasterViewModel } from "../../../view-models/user/user-master.view-model"
import { DepartmentBaseViewModel } from "../../../view-models/department/department-base.view-model";
import { RoleBaseViewModel } from "../../../view-models/role/role-base.view-model";
import { DepartmentService } from "../../../services/department.service";
import { RoleService } from "../../../services/role.service";
import { UserCreateUpdateViewModel } from "../../../view-models/user/user-create-update.view-model";
import * as Yup from "yup";
import { UserService } from "../../../services/user.service";
import { FormField } from "../../../shared/components/FormBase";
import { MasterCreateUpdate } from "../MasterCreateUpdate";
import moment from "moment";
import fileService from "../../../services/file.service";
import { EnumHelper } from "../../../helpers/enum.helper";
import { GenderEnum } from "../../../enums/gender.enum";

type UserDetailProps = {
    readonly item: UserMasterViewModel | null | undefined;
    readonly onCancel: () => void;
}

function UserCreateUpdateComponent(props: UserDetailProps) {
    const { item, onCancel } = props;
    const [departments, setDepartments] = useState<DepartmentBaseViewModel[]>([]);
    const [roles, setRoles] = useState<RoleBaseViewModel[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

    const initialValues: UserCreateUpdateViewModel = {
        fullName: item ? item.fullName : '',
        email: item ? item.email : '',
        phoneNumber: item ? item.phoneNumber : '',
        dateOfBirth: item ? moment(item.dateOfBirth).format('YYYY-MM-DD') : '',
        active: item ? item.active : true,
        gender: item ? item.gender : false,
        avatar: '',
        address: item ? item.address : '',
        note: item ? item.note : '',
        departmentId: item ? item.department.id : '',
        roleIds: item ? item.roles.map((role) => role.id) : []
    };

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full name sis required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
        dateOfBirth: Yup.date().required('Date of birth is required').max(new Date(), 'Date of birth must be before today'),
        active: Yup.boolean().required('Is active is required'),
        gender: Yup.boolean().required('Gender is required'),
        address: Yup.string().required('Address is required').max(255, 'Adress must be at most 255 characters'),
        note: Yup.string().required('Not is required').max(500, 'Note must be at most 500 cahracters'),
        departmentId: Yup.string().required('Department is required'),
        roleIds: Yup.array().min(1, 'Select at least one role').required('Roles are required')
    });

    const onSubmit = async (values: UserCreateUpdateViewModel) => {
        if (avatarFile) {
            const fileUrl = await fileService.uploadFileToAzure(avatarFile);
            if (fileUrl) values.avatar = fileUrl;
        } else {
            values.avatar = item?.avatar || '';
        }

        if (item) {
            const response = await UserService.update(item.id, values);
            if (response) {
                onCancel();
            }
        } else {
            const response = await UserService.create(values);
            if (response) {
                onCancel();
            }
        }
    }

    const fields: FormField[] = [
        { name: 'fullName', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
        { name: 'dateOfBirth', label: 'Date of birth', type: 'date' },
        {
            id: 'create-update-gender',
            name: 'gender',
            label: 'Gender',
            options: [
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Male), value: false },
                { label: EnumHelper.getDisplayValue(GenderEnum, GenderEnum.Female), value: true },

            ]
        },
        {
            id: 'create-update-departmentId',
            name: 'departmentId',
            label: 'Department',
            as: 'select',
            options: departments.map(dept => ({ label: dept.name, value: dept.id })),
        },
        {
            id: 'create-update-roleIds',
            name: 'roleIds',
            label: 'Roles',
            as: 'select',
            multiple: true,
            options: roles.map(role => ({ label: role.name, value: role.id })),
        },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'note', label: 'Note', as: 'textarea', className: 'w-1/2' },
        { name: 'active', label: 'Active', type: 'checkbox', className: 'w-none' },
        {
            name: "avatar",
            label: "Avatar",
            type: "file",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    setAvatarFile(e.target.files[0]);
                }
            },
            isImageInput: true,
            imagePreview: item?.avatar as string | undefined
        },
    ];

    return (
        <MasterCreateUpdate<UserCreateUpdateViewModel>
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialValues={initialValues}
            validationSchema={validationSchema}
            fields={fields}
            title={item ? 'Edit User' : 'Create User'}
        />
    );
}

export default UserCreateUpdateComponent;