export class EnumHelper {
    static getDisplayValue(enumObj: any, value: number | string): string {
        return Object.keys(enumObj)
            .find(key => enumObj[key] === value) || String(value);
    }

    static convertEnumToArray(enumObj: any): Array<{ key: string; value: any }> {
        return Object.keys(enumObj)
            .filter(key => isNaN(Number(key)))
            .map(key => ({ key, value: enumObj[key]}));
    }
}