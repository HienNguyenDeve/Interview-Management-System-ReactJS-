import React, { useCallback, useEffect, useMemo, useState } from "react";
import { OrderDirectionEnum } from "../../../enums/order-direction.enum";
import { PageInfoModel } from "../../../models/page-infor.model";
import { TableColumnModel } from "../../../models/table-column.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { EnumHelper } from "../../../helpers/enum.helper";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface TablePaginationProps<T extends { id: React.Key } & Record<string, unknown>> {
    data: T[];
    defaultSortBy: string;
    pageInfo: PageInfoModel;
    columns: TableColumnModel<T>[];
    search: (page: number, size: number, sortBy: string, order: OrderDirectionEnum) => void;
    sizeList: number[] | undefined;
}

const TablePagination = <T extends { id: React.Key } & Record<string, unknown>> (
    { data, defaultSortBy, pageInfo, columns, search, sizeList = [10, 20, 50, 100] }: TablePaginationProps<T>
) => {
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>(defaultSortBy);
    const [order, setOrder] = useState<OrderDirectionEnum>(OrderDirectionEnum.ASC);
    const [pageLimit] = useState<number>(3);

    useEffect(() => {
        search(page, size, sortBy, order);
    }, [size, page, sortBy, order]);

    const calculatePage = useMemo(() => {
        if (!pageInfo) return [];
        const start: number = Math.max(0, page - pageLimit);
        const end: number = Math.min(pageInfo.totalPages - 1, page + pageLimit);
        const pageList: number[] = [];
        for (let i = start; i < end; i++) {
            pageList.push(i);
        }
        return pageList;
    }, [page, pageLimit, pageInfo]);

    const sortByField = useCallback((field: string) => {
        setSortBy(field);
        setOrder(sortBy === field && order === OrderDirectionEnum.DESC ? OrderDirectionEnum.ASC : OrderDirectionEnum.DESC);
    }, [sortBy, order]);

    return (
        <div className="card border border-slate-300 rounded-md my-4">
            <div className="card-body p-3 border-y border-slate-300 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="*:border *:border-slate-300 *:p-3">
                            <th>No</th>
                            {
                                columns.map((column: TableColumnModel<T>) => (
                                    <th key={column.field}>
                                        {column.sortable ? (
                                            <button type="button" onClick={() => sortByField(column.field)}>
                                                {column.label}
                                                <FontAwesomeIcon icon={order === OrderDirectionEnum.DESC && sortBy === column.field ?
                                                    column.iconASC as IconDefinition : column.iconDESC as IconDefinition} className="ml-2" />
                                            </button>) : column.label
                                        }
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {data.length !== 0 && data.map((item, index) => (
                            <tr key={item.id} className="*:border *:border-slate-300 *:p-3">
                                <td>
                                    {pageInfo.size * pageInfo.number + index + 1}
                                </td>
                                {columns.map((column: TableColumnModel<T>) => (
                                    <td>
                                        {column.render ? column.render(item) : (column.isEnum ?
                                            EnumHelper.getDisplayValue(column.enum, item[column.field] as string)
                                            : String(item[column.field]))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {
                            data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + 1 } className="text-2xl font-bold text-center">No data</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className="card-footer p-3 flex justify-between">
                {/* Select page Size */}
                <div className="select-page-size flex items-center">
                    <label htmlFor="pageSize" className="block mr-2">Items per page: </label>         
                    <select name="pageSize" id="pageSize" onChange={(e) =>
                            setSize(parseInt(e.target.value))} value={size}
                            title="Select Page Size" className="p-2 border
                            border-slate-300 rounded-sm"
                    >
                        {sizeList.map((item) => (
                            <option value={item} key={item}>{item}</option>
                        ))}
                    </select>
                </div>
                {/* List page */}
                <div className="list-page flex items-center space-x-3 *:w-8 *:h-8 *:flex
                    *:justify-center *:items-center *:rounded-full *:border *:border-slate-300"
                >
                    <button type="button" disabled={page === 0} onClick={() => setPage(0)}
                            title="First Page" className={`${page === 0 ? 'cursor-not-allowed' : 
                            'hover:bg-blue-500 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft} className={page === 0 ?
                            'text-slate-400' : 'text-blue-500'}></FontAwesomeIcon>
                    </button>
                    <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}
                            title="Previous Page" className={`${page === 0 ? 'cursor-not-allowed' : 
                            'hover:bg-blue-500 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} className={page === 0 ?
                            'text-slate-400' : 'text-blue-500'}></FontAwesomeIcon>
                    </button>
                    {calculatePage.map((item) => (
                        <button key={item} type="button" onClick={() => setPage(item)}
                            title={`Page ${item}`} disabled={page === item} className={`text-blue-500 ${page === item ?
                            'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
                        >
                            {item + 1}
                        </button>
                    ))}
                    <button type="button" disabled={page === pageInfo.totalPages - 1} onClick={() => setPage(page + 1)}
                            title="Next Page" className={`${page === pageInfo.totalPages - 1 ? 'cursor-not-allowed' : 
                            'hover:bg-blue-500 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faAngleRight} className={page === pageInfo.totalPages - 1 ?
                            'text-slate-400' : 'text-blue-500'}></FontAwesomeIcon>
                    </button>
                    <button type="button" disabled={page === pageInfo.totalPages - 1}
                            onClick={() => setPage(pageInfo.totalPages - 1)}
                            title="Last Page" className={`${page === pageInfo.totalPages - 1 ? 'cursor-not-allowed' : 
                            'hover:bg-blue-500 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleRight} className={page === pageInfo.totalPages - 1 ?
                            'text-slate-400' : 'text-blue-500'}></FontAwesomeIcon>
                    </button>
                </div>
                {/* Page Info */}
                <div className="page-info">
                    {pageInfo && `${pageInfo.size * pageInfo.number + 1}-
                    ${Math.min(pageInfo.size * (pageInfo.number + 1), pageInfo.totalElements)} of
                    ${pageInfo.totalElements}`}
                </div>
            </div>
        </div>
    )
}

export default TablePagination;