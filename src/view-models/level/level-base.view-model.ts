import { BaseViewModel } from "../base.view-model";

export class LevelBaseViewModel extends BaseViewModel implements Record<string, unknown> {
    public title!: string;
    public description!: string;
    [key: string]: unknown;
}