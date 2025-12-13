import { SkillViewModel } from "../view-models/skill/skill.view-model";
import { BaseService } from "./base.service";

export const SkillService = BaseService<SkillViewModel, SkillViewModel, any, any, any>('skills');