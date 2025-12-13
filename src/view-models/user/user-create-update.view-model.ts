import { FormikValues } from "formik";

export interface UserCreateUpdateViewModel extends FormikValues {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    active: boolean;
    gender: boolean;
    address: string;
    note: string;
    departmentId: string;
    roleIds: string[];
}