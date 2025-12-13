import { SearchFilterViewModel } from "../search-filter.view-model";

export class UserSearchViewModel extends SearchFilterViewModel {
    public departmentId?: string;
    public roleIds?: string[];
    public gender?: boolean | null;
    public active: boolean = true;

    constructor(init?: Partial<UserSearchViewModel>) {
        super();
        Object.assign(this, init);
        this.sortBy = 'username';
    }
}