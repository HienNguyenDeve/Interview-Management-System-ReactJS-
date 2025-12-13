import { CandidateStatus } from "../../enums/candidate-status.enum";
import { HighestLevelEnum } from "../../enums/highest-level.enum";
import { SearchFilterViewModel } from "../search-filter.view-model";

export class CandidateSearchViewModel extends SearchFilterViewModel {
    public positionId?: string;
    public recruiterId?: string;
    public skillIds?: string[];
    public yearsOfExperience?: number;
    public highestLevel?: HighestLevelEnum;
    public candidateStatus?: CandidateStatus;
    public gender?: boolean | null;
    public active: boolean = true;

    constructor(init?: Partial<CandidateSearchViewModel>) {
        super();
        Object.assign(this, init);
        this.sortBy = 'fullName';
    }
}