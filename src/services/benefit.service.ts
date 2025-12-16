import { BenefitBaseViewModel } from "../view-models/benefit/benefit-base.view-model";
import { BenefitViewModel } from "../view-models/benefit/benefit.view-model";
import { BaseService } from "./base.service";

export const BenefitService = BaseService<BenefitBaseViewModel, BenefitViewModel, any, any, any>('benefits');