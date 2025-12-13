import { PositionBaseViewMovel } from "../view-models/position/position-base.view-model";
import { PositionViewModel } from "../view-models/position/position.view-model";
import { BaseService } from "./base.service";

export const PositionSerivce = BaseService<PositionBaseViewMovel, PositionViewModel, any, any, any>('positions');