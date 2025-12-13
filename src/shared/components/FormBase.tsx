import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import React from "react";
import * as Yup from 'yup';
import Select, { Option } from '../../core/components/controls/Select';
import InputFile from "../../core/components/controls/InputFile";

export interface FormField {
    name: string;
    label: string;
    className?: string;
    type?: string;
    as?: string;
    multiple?: boolean;
    options?: Option[];
    id?: string;
    isImageInput?: boolean;
    imagePreview?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => string | void;
    clickLable?: string;
    clickIcon?: IconDefinition;
}

interface FormBaseProps<T extends FormikValues> {
    readonly initialValues: T;
    readonly validationSchema: Yup.AnyObjectSchema;
    readonly onSubmit: (values: T) => Promise<void>;
    readonly formFields: FormField[];
    readonly actions?: React.ReactNode;
}

function FormBase<T extends FormikValues>(props: FormBaseProps<T>) {
    const { initialValues, validationSchema, onSubmit, formFields, actions } = props;

    const renderField = (field: FormField) => {
        if (field.as === 'select' && field.options) {
            if (!field.options) {
                throw new Error('Select field must have options');
            }
            return (
                <Select
                    id={field.id}
                    name={String(field.name)}
                    options={field.options}
                    multiple={field.multiple}
                    clickLabel={field.clickLable}
                    clickIcon={field.clickIcon}
                    click={field.onClick}
                />
            );
        } else if (field.type === 'checkbox' || field.type === 'radio' || field.as === 'checkbox' || field.as === 'radio') {
            return (
                <Field type={field.as ?? field.type} id={`create-update-${String(field.name)}`} name={String(field.name)}
                    className="p-2 border border-slate-300 rounded-sm w-full focus-visible:border-blue-500" />
            );
        } else if (field.as === 'textarea') {
            return (
                <Field as="textarea" id={`search-${String(field.name)}`} name={String(field.name)}
                    className="p-2 border border-slate-300 rounded-sm w-full focus-visible:border-blue-500"
                    placeholder={`Enter ${field.label}`} />
            );
        } else if (field.type === 'file') {
            return (
                <InputFile field={field} />
            );
        } else if (field.type === 'date') {
            return (
                <Field type="date" id={`create-update-${String(field.name)}`} name={String(field.name)}
                    className="p-2 border border-slate-300 rounded-sm focus-visible:border-blue-500 w-full" />
            )
        } else {
            return (
                <Field type={field.type ?? "text"} id={`search-${String(field.name)}`} name={String(field.name)}
                    placeholder={`Enter ${field.label}`}
                    className={`p-2 border border-slate-300 rounded-s-md focus-visible:border-blue-500 ${field.type === 'checkbox' || field.type === 'radio' ? '' : 'w-full'}`} />
            );
        }
    }
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            <Form>
                <div className="p-3 border-y border-slate-300">
                    <div className="flex flex-wrap">
                        {formFields.map((field) => (
                            <div key={String(field.name)} className={`form-group p-2 ${field.className ?? 'w-full md:w-1/2'}`}>
                                <label htmlFor={String(field.name)} className="block mb-2">{field.label}</label>
                                {renderField(field)}
                                <ErrorMessage name={String(field.name)} component="div" className="text-red-500"></ErrorMessage>
                            </div>
                        ))}
                    </div>
                </div>
                {actions}
            </Form>
        </Formik>
    )
}

export default FormBase;