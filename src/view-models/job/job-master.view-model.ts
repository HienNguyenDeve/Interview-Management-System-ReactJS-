import { BenefitViewModel } from "../benefit/benefit.view-model";
import { LevelViewModel } from "../level/level.view-model";
import { MasterBaseViewModel } from "../master-base.view-model";
import { SkillViewModel } from "../skill/skill.view-model";

export class JobMasterViewModel extends MasterBaseViewModel {
    public title!: string;
    public startDate!: Date | null;
    public endDate!: Date | null;
    public workingAddress!: string;
    public description!: string;
    public salaryFrom!: number;
    public salaryTo!: number;
    public status!: string;
    public skills!: SkillViewModel[];
    public benefits!: BenefitViewModel[];
    public levels!: LevelViewModel[];
}