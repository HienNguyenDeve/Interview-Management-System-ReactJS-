import { UserInformation } from "../models/auth/login-response.model";
import { DataResponseViewModel } from "../view-models/data-response.view-model";
import { ChangePasswordViewModel } from "../view-models/user/change-password.view-model";
import { ProfileUpdateViewModel } from "../view-models/user/profile-update.view-model";
import { UserBaseViewModel } from "../view-models/user/user-base.view-model";
import { UserCreateUpdateViewModel } from "../view-models/user/user-create-update.view-model";
import { UserMasterViewModel } from "../view-models/user/user-master.view-model";
import { UserSearchViewModel } from "../view-models/user/user-search.view-model";
import api from "./api.service";
import { BaseService } from "./base.service";

const UserService = BaseService<
    UserBaseViewModel,
    UserMasterViewModel,
    UserCreateUpdateViewModel,
    UserSearchViewModel,
    DataResponseViewModel<UserMasterViewModel[]>>('users');

const editProfile = async (data: ProfileUpdateViewModel) => {
    return await api.put<UserInformation>('users/update-profile', data);
}

const changePassword = async (data: ChangePasswordViewModel) => {
    return await api.put<boolean>('/users/change-password', data);
}

const toggleActiveStatus = async (userId: string, isActive: boolean) => {
    return await api.put<boolean>(`users/${userId}/active`, { isActive: isActive });
}

export { UserService, editProfile, changePassword, toggleActiveStatus };