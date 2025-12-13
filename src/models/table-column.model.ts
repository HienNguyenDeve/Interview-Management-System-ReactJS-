import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSortAlphaAsc, faSortAlphaDesc } from "@fortawesome/free-solid-svg-icons";
import { JSX } from "react";

export class TableColumnModel<T> {
    public field: string = '';
    public label: string = '';
    public iconASC?: IconDefinition = faSortAlphaAsc;
    public iconDESC?: IconDefinition = faSortAlphaDesc;
    public isEnum?: boolean = false;
    public enum?: Record<string, string> | null = null;
    public sortable?: boolean = true;
    public isShow?: boolean = true;
    public render?: (item: T) => JSX.Element;

    constructor(init?: Partial<TableColumnModel<T>>) {
        Object.assign(this, init);
    }
}