export class LoginResponseModel {
    public accessToken!: string;
    public user!: UserInformation;
}

export class UserInformation {
    public id!: string;
    public fullName!: string;
    public username!: string;
    public email!: string;
    public phoneNumber!: string;
    public dateOfBirth!: string;
    public gender!: boolean;
    public avatar!: string;
    public address!: string;
    public note!: string;
    public roles!: string[];
    public departmentName!: string;
    public active!: boolean;
}