import { SearchFilterViewModel } from "../search-filter.view-model";

export class JobSearchViewModel extends SearchFilterViewModel {
    public salaryFrom?: number;
    public salaryTo?: number;
    public startDate?: string | null;
    public endDate?: string | null;
    public status?: string;
    public benefitIds?: string[];
    public levelIds?: string[];
    public skillIds?: string[];

    constructor(init: Partial<JobSearchViewModel>) {
        super();
        Object.assign(this, init);
        this.sortBy = 'title';
    }
}