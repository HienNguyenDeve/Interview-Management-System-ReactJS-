import { FormikValues } from "formik";

export interface JobCreateUpdateViewModel extends FormikValues{
    title: string;
    startDate: string;
    endDate: string;
    workingAddress: string;
    description: string;
    salaryFrom: number;
    salaryTo: number;
    status: string;
    skillIds: string[];
    benefitIds: string[];
    levelIds: string[];
}