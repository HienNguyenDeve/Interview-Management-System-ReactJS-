import { MasterBaseViewModel } from "../master-base.view-model";
import { PositionViewModel } from "../position/position.view-model";
import { SkillViewModel } from "../skill/skill.view-model";
import { UserMasterViewModel } from "../user/user-master.view-model";

export class CandidateMasterViewModel extends MasterBaseViewModel implements Record<string, unknown>{
    public fullName!: string;
    public email!: string;
    public phoneNumber!: string;
    public dateOfBirth!: Date;
    public isActive!: boolean;
    public gender!: boolean;
    public address!: string;
    public note!: string;
    public position!: PositionViewModel;
    public yearsOfExprience!: number;
    public highestLevel!: string;
    public status!: string;
    public cv!: string;
    public recruiter!: UserMasterViewModel;
    public skills!: SkillViewModel[];
    [key: string]: unknown;
}