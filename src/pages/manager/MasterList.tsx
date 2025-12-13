import { FormikValues } from "formik";
import { DataResponseViewModel } from "../../view-models/data-response.view-model";
import * as Yup from 'yup';
import React, { forwardRef, JSX, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PageInfoModel } from "../../models/page-infor.model";
import { ModalType } from "../../enums/modal-type.enum";
import { OrderDirectionEnum } from "../../enums/order-direction.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../core/components/modals/Modal";
import { TableColumnModel } from "../../models/table-column.model";
import FormBase, { FormField } from "../../shared/components/FormBase";
import TablePagination from "../../core/components/table/TablePagination";

interface MasterListProps<T, S extends FormikValues> {
    fetchData: (filter: S) => Promise<DataResponseViewModel<T[]> | undefined>;
    columns: Array<TableColumnModel<T>>;
    sortBy: string;
    initialFilter: S;
    validationSchema: Yup.AnyObjectSchema;
    searchFields: FormField[];
    EntityCreateUpdateComponent: React.ComponentType<{
        item: T | null;
        onCancel: () => void; onSubmit: (value: S) => Promise<void>
    }>;
    title: string;
    pageSizeList?: number[];
}

export interface MasterListHandle<T> {
    onEdit: (item: T) => void;
    refresh: () => void;
}

export const MasterList = forwardRef(function MasterList
    <
        T extends { id: React.Key },
        S extends FormikValues
    >
    (
        props: MasterListProps<T, S>,
        ref: React.ForwardedRef<MasterListHandle<T>>
    ) {

    const { fetchData, columns, sortBy, initialFilter, validationSchema, searchFields,
        EntityCreateUpdateComponent, title, pageSizeList } = props;
    const [data, setData] = useState<T[]>([]);
    const [filter, setFilter] = useState<S>(initialFilter);
    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoModel>({ number: 0, size: 10, totalElements: 0, totalPages: 0 });
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.INFO);
    const detailForm = useRef<HTMLDivElement>(null);
    const toggleDetailForm = useCallback((item?: T | null) => {
        setIsShowDetail(false);
        setSelectedItem(item ?? null);
        setTimeout(() => setIsShowDetail(true));
    }, []);

    const searchData = useCallback(async () => {
        try {
            const response = await fetchData(filter);
            if (response) {
                setData(response.data);
                setPageInfo(response.page);
            }
        } catch (error) {
            console.error('Fetch error: ', error);
            setModalMessage("An error occurred while fetching data: " + error);
            setModalType(ModalType.DANGER);
        }
    }, [fetchData, filter]);

    const handleSearchSubmit = async (values: S) => {
        setFilter({ ...filter, ...values });
    };

    const onSearch = (page: number, size: number, sortBy: string, order: OrderDirectionEnum) => {
        setFilter({ ...filter, page, size, sortBy, order } as S);
    };

    const onCreate = () => {
        toggleDetailForm();
    };

    const onCancelDetail = () => {
        setIsShowDetail(false);
        setSelectedItem(null);
        searchData();
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            searchData();
        })
    }, [searchData]);

    useEffect(() => {
        if (isShowDetail && detailForm.current) {
            detailForm.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isShowDetail]);

    useImperativeHandle(ref, () => ({
        onEdit: (item: T) => toggleDetailForm(item),
        refresh: () => searchData()
    }));

    const actions = (
        <div className="actions p-3 space-x-3 flex justify-between">
            <button type="button" className="p-2 px-4 bg-green-500 text-white
               hover:border-green-700 rounded-full" onClick={onCreate}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
            </button>
            <div className="search-actions space-x-3">
                <button type="reset" className="p-2 px-4 bg-slate-300
                  text-white hover:bg-slate-500 rounded-full">
                    <FontAwesomeIcon icon={faEraser} className="mr-2" /> Clear
                </button>
                <button type="submit" className="p-2 px-4 bg-blue-500 text-white
                    hover:bg-blue-700 rounded-full">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
                </button>
            </div>
        </div>
    )

    return (
        <section className="w-full">
            <div className="card border border-slate-300 rounded-md">
                <div className="card=header p-3">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                </div>
            </div>
            <FormBase<S>
                initialValues={initialFilter}
                validationSchema={validationSchema}
                onSubmit={handleSearchSubmit}
                formFields={searchFields}
                actions={actions}
            />
            {/* Table List With Paging */}
            <TablePagination<T>
                data={data}
                defaultSortBy={sortBy}
                pageInfo={pageInfo}
                columns={columns}
                search={onSearch}
                sizeList={pageSizeList}
            />

            {/* Modal for messages */}
            <Modal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                title="Notification"
                modalType={modalType}
            >
                <p>{modalMessage}</p>
            </Modal>

            {/* Details Component */}
            <div>
                {isShowDetail && <EntityCreateUpdateComponent item={selectedItem}
                    onCancel={onCancelDetail} onSubmit={handleSearchSubmit} />}
            </div>
        </section>
    );
}) as <T extends { id: React.Key }, S extends FormikValues>(props: MasterListProps<T, S>
    & React.RefAttributes<MasterListHandle<T>>) => JSX.Element;