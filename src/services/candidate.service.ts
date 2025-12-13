import { CandidateBaseViewModel } from "../view-models/candidate/candidate-base.view-model";
import { CandidateCreateUpdateViewModel } from "../view-models/candidate/candidate-create-update.view-model";
import { CandidateMasterViewModel } from "../view-models/candidate/candidate-master.view-model";
import { CandidateSearchViewModel } from "../view-models/candidate/candidate-search.view-model";
import { DataResponseViewModel } from "../view-models/data-response.view-model";
import { BaseService } from "./base.service";

const CandidateService = BaseService<
    CandidateBaseViewModel,
    CandidateMasterViewModel,
    CandidateCreateUpdateViewModel,
    CandidateSearchViewModel,
    DataResponseViewModel<CandidateMasterViewModel[]>>('candidates');

export { CandidateService }