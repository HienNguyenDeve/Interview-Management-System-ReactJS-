import { DataResponseViewModel } from "../view-models/data-response.view-model";
import { InterviewBaseViewModel } from "../view-models/interview/interview-base.view-model";
import { InterviewCreateUpdateViewModel } from "../view-models/interview/interview-create-update.view-model";
import { InterviewMasterViewModel } from "../view-models/interview/interview-master.view-model";
import { InterviewSearchViewModel } from "../view-models/interview/interview-search.view-model";
import { BaseService } from "./base.service";

const InterviewService = BaseService<
    InterviewBaseViewModel,
    InterviewMasterViewModel,
    InterviewCreateUpdateViewModel,
    InterviewSearchViewModel,
    DataResponseViewModel<InterviewMasterViewModel[]>>('interviews');

export { InterviewService };