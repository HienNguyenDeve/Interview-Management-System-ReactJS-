export enum HighestLevelEnum {
    HIGH_SCHOOL = "HIGH_SCHOOL",
    BACHELOR = "BACHELOR",
    MASTER = "MASTER",
    PHD = "PHD"
}

export function getHighestLevelLabel(value: HighestLevelEnum) {
    switch (value) {
        case HighestLevelEnum.HIGH_SCHOOL:
            return "High School";
        case HighestLevelEnum.BACHELOR:
            return "Bachelor";
        case HighestLevelEnum.MASTER:
            return "Master";
        case HighestLevelEnum.PHD:
            return "PHD";
        default:
            return value;
    }
}