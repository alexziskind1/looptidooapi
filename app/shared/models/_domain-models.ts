/*import * as enums from './domain-enums';

export interface PtLoginModel {
    username: string;
    password: string;
}

export interface PtRegisterModel {
    username: string;
    password: string;
    fullName: string;
}

export interface PtObjectBase {
    id: number;
    title?: string;
    dateCreated: Date;
    dateModified: Date;
    dateDeleted?: Date;
}

export interface PtAuthToken {
    access_token: string;
    dateExpires: Date;
}

export interface PtUserAuthInfo {
    email: string;
    password: string;
}

export interface PtUser extends PtObjectBase {
    fullName: string;
    avatar: string;
    gender: enums.GenderEnum;
    authInfo?: PtUserAuthInfo;
}

export interface PtItem extends PtObjectBase {
    description?: string;
    type: enums.ItemTypeEnum;
    estimate: number;
    priority: enums.PriorityEnum;
    status: enums.StatusEnum;
    assignee: PtUser;
    tasks: Array<PtTask>;
    comments: Array<PtComment>;
}

export interface PtTask extends PtObjectBase {
    completed: boolean;
}

export interface PtComment extends PtObjectBase {
    user: PtUser;
}

export interface PtNewTask {
    title: string;
    completed: boolean;
}

export interface PtNewComment {
    title: string;
    userId: number;
}

export interface PtNewItem {
    title: string;
    description?: string;
    type: enums.ItemTypeEnum;
}


*/
