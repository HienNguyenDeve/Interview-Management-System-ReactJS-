import { LevelBaseViewModel } from "../view-models/level/level-base.view-model";
import { LevelViewModel } from "../view-models/level/level.view-model";
import { BaseService } from "./base.service";

export const LevelService = BaseService<LevelBaseViewModel, LevelViewModel, any, any, any>('levels');