import { DataResponseViewModel } from "../view-models/data-response.view-model";
import { JobBaseViewModel } from "../view-models/job/job-base.view-model";
import { JobCreateUpdateViewModel } from "../view-models/job/job-create-update.view-model";
import { JobMasterViewModel } from "../view-models/job/job-master.view-model";
import { JobSearchViewModel } from "../view-models/job/job-search.view-model";
import { BaseService } from "./base.service";

const JobService = BaseService<
    JobBaseViewModel,
    JobMasterViewModel,
    JobCreateUpdateViewModel,
    JobSearchViewModel,
    DataResponseViewModel<JobMasterViewModel[]>>('jobs');

export { JobService };