import { FormikValues } from "formik";

export interface CandidateCreateUpdateViewModel extends FormikValues{
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    note: string;
    gender: boolean;
    recruiterId: string;
    positionId: string;
    yearsOfExprience: number;
    highestLevel: string;
    status: string;
    cv: string;
    skillIds: string[];
}