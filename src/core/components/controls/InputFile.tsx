import React, { useEffect, useRef, useState } from "react";
import { FormField } from "../../../shared/components/FormBase"
import { ErrorMessage, Field } from "formik";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type InputFileProps = {
    readonly field: FormField;
}

export default function InputFile({ field }: InputFileProps) {
    const [fileName, setFileName] = useState("Upload File Here ...");
    const [selectedImg, setSelectedImg] = useState<File>();
    const [preview, SetPreview] = useState<string>(field.imagePreview ?? "");
    const inputImageRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (field.onChange) field.onChange(e);
        if (e.target.files?.[0]) {
            setFileName(e.target.files[0].name);
            setSelectedImg(e.target.files[0]);
        }
    };

    const removeSelectedImg = () => {
        setSelectedImg(undefined);
        SetPreview("");
        if (inputImageRef?.current) {
            inputImageRef.current.value = "";
            setFileName("Upload File here ...");
        }
    };

    useEffect(() => {
        console.log(field);

        if (selectedImg) {
            const reader = new FileReader();
            reader.onloadend = () => SetPreview(reader.result as string);
            reader.readAsDataURL(selectedImg);
        }
    }, [selectedImg]);

    return (
        <div>
            <Field
                id={`create-update-${String(field.name)}`}
                name={String(field.name)}
                type="file"
                innerRef={inputImageRef}
                onChange={handleFileChange}
                className="hidden"
            ></Field>
            <label htmlFor={`create-update-${String(field.name)}`}
                className="flex justify-between items-center border border-slate-300 rounded-sm w-full h-[40px] cursor-pointer"
            >
                <span className="ml-2 flex-grow">{fileName}</span>
                <button type="button" className="p-2 bg-blue-500 text-white hover:bg-blue-700 pointer-events-none">
                    <FontAwesomeIcon icon={faUpload} className="mr-2"></FontAwesomeIcon>
                    Browse
                </button>
                {selectedImg && field.isImageInput && (
                    <button type="button" className="p-2 bg-red-500 text-white hover:bg-red-700" onClick={removeSelectedImg}>
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                )}
            </label>
            <ErrorMessage name={String(field.name)} component="div" className="text-red-500"></ErrorMessage>
            {preview && field.isImageInput && <img src={preview} alt="Preview" />}
        </div>
    );
}