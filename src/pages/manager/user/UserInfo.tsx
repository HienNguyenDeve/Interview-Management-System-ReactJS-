import React from "react";
import { UserMasterViewModel } from "../../../view-models/user/user-master.view-model";

interface UserInfoProps{
    user: UserMasterViewModel;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="flex flex-wrap p-4">
            <img src="" alt="User Avatar" className="w-full md:w-2/5 rounded-full object-cover" />
            <div className="w-full md:w-3/5 space-y-4 pl-0 md:pl-4">
                <h2 className="text-xl font-semibold">{user.fullName}</h2>
                <p><strong>Username:</strong>{user.username}</p>
                <p><strong>Email:</strong>{user.email}</p>
                <p><strong>Phone Number:</strong>{user.phoneNumber}</p>
                <p><strong>Gender::</strong>{user.gender ? "Female" : "Male"}</p>
                <p><strong>Department:</strong>{user.department?.name}</p>
                <p><strong>Roles:</strong>{user.roles?.map(role => role.name).join(', ')}</p>
                <p><strong>Active:</strong>{user.active ? "Active" : " Inactive(Banned)"}</p>
            </div>
        </div>
    );
}

export default UserInfo;