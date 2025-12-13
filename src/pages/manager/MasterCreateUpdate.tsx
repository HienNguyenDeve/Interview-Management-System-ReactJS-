import { FormikValues } from "formik";
import * as Yup from "yup";
import FormBase, { FormField } from "../../shared/components/FormBase";
import { useState } from "react";
import { ModalType } from "../../enums/modal-type.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faRotateLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../core/components/modals/Modal";

interface MasterCreateUpdateProps<S extends FormikValues> {
    readonly onSubmit: (values: S) => Promise<void>;
    readonly onCancel: () => void;
    readonly initialValues: S;
    readonly validationSchema: Yup.AnyObjectSchema;
    readonly fields: FormField[];
    readonly title: string;
}

export function MasterCreateUpdate<S extends FormikValues>(props: MasterCreateUpdateProps<S>) {
    const { onSubmit, onCancel, initialValues, validationSchema, fields, title } = props;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.INFO);

    const handleSubmit = async (values: S) => {
         // Ensure values are of type S
         try {
            await onSubmit(values);
         } catch (error) {
            setModalMessage("An error occured during submission" + error);
            setModalType(ModalType.DANGER);
            setShowModal(true);
         }
    };

    const actions = (
        <div className="actions p-3 space-x-3 flex justify-between">
            <button type="button" className="p-2 px-4 bg-slate-200 hover:bg-slate-300 rounded-full" onClick={onCancel}>
                <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
                Cancel
            </button>
            <div className="search-actions space-x-3">
                <button type="reset" className="p-2 px-4 bg-slate-300 text-white hover:bg-slate-500 rounded-full">
                    <FontAwesomeIcon icon={faEraser} className="mr-2" /> Clear
                </button>
                <button type="submit" className="p-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded-full">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Save
                </button>
            </div>
        </div>
    )

    return (
        <>
            <div className="w-full">
                {/* Detail */}
                <div className="card border border-slate-300 rounded-full">
                    <div className="card-header p-3">
                        <h2 className="text-xl font-semibold">
                            {title}
                        </h2>
                    </div>
                    <FormBase<S>
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        formFields={fields}
                        actions={actions}
                    ></FormBase>
                </div>
            </div>

            {/* Modal for any submission error/warning */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Alert"
                modalType={modalType}
            >
                <p>{modalMessage}</p>
            </Modal>
        </>
    );
}