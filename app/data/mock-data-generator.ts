
//nativescript imports
import * as fileSystemModule from 'fs';

//3rd party imports
import * as faker from 'faker';
import * as _ from 'lodash';


//app imports
import { toTitleCase } from "../util/string-utils";
import { PtItem, PtUser, PtTask, PtComment } from '../shared/models/domain-models';
import { PriorityEnum, ItemTypeEnum, StatusEnum, GenderEnum } from '../shared/models/domain-enums';


const NUM_PT_ITEMS = 50;
const NUM_USERS = 20;


export function generatePTItems(users: Array<PtUser>): Array<PtItem> {
    let items = _.times(NUM_PT_ITEMS, (index: number) => {
        return generatePTItem(index, users);
    });
    return items;
}

export function generatePTItem(index: number, users: Array<PtUser>): PtItem {
    let date = faker.date.past(1);
    let title = toTitleCase(faker.company.bs());

    let typeStr = ItemTypeEnum[_.random(1, 4)];
    let type = ItemTypeEnum[typeStr];

    let priorityStr = PriorityEnum[_.random(1, 4)];
    let priority = PriorityEnum[priorityStr];

    let statusStr = StatusEnum[_.random(1, 4)];
    let status = StatusEnum[statusStr];

    let ptItem: PtItem = {
        id: index + 1,
        title: title,
        dateCreated: date,
        dateModified: date,
        type: type,
        estimate: _.random(1, 24),
        priority: priority,
        status: status,
        assignee: _.sample(users),
        tasks: generateTasks(),
        comments: generateComments(users)
    };

    return ptItem;
}

export function generateTasks(): Array<PtTask> {
    let numTasks = _.random(5, 20);
    let tasks = _.times(numTasks, (index: number) => {
        return generateTask(index);
    });
    return tasks;
}

export function generateTask(index: number): PtTask {
    let date = faker.date.past(1);
    let title = toTitleCase(faker.company.bs());
    let task: PtTask = {
        id: index + 1,
        title: title,
        dateCreated: date,
        dateModified: date,
        completed: faker.random.boolean()
    };
    return task;
}

export function generateUsersBase64Avatars(): Array<PtUser> {
    let avatarsMenBase64 = getUserAvatars('app/images/avatars/base64/men.txt');
    let avatarsWomenBase64 = getUserAvatars('app/images/avatars/base64/women.txt');

    let users = _.times(NUM_USERS, (index: number) => {
        return generateUserBase64Avatar(index, avatarsMenBase64, avatarsWomenBase64);
    });
    let userMe = getMeUserBase64(users.length);
    users.unshift(userMe);
    return users;
}

export function generateUsers(): Array<PtUser> {
    let users = _.times(NUM_USERS, (index: number) => {
        return generateUser(index);
    });

    let userMe = getMeUser(users.length);
    users.unshift(userMe);
    return users;
}

export function getMeUserBase64(index: number): PtUser {
    let avatarMe = getUserAvatars('app/images/avatars/base64/me.txt')[0];
    let date = faker.date.past(1);
    let userMe: PtUser = {
        id: index + 1,
        fullName: 'Alex Ziskind',
        avatar: avatarMe,
        gender: GenderEnum.Male,
        dateCreated: date,
        dateModified: date
    };
    return userMe;
}

export function getMeUser(index: number): PtUser {
    let date = faker.date.past(1);
    let userMe: PtUser = {
        id: index + 1,
        fullName: 'Alex Ziskind',
        avatar: 'app/images/avatars/me/me.png',
        gender: GenderEnum.Male,
        dateCreated: date,
        dateModified: date
    };
    return userMe;
}

export function generateUserBase64Avatar(index: number, avatarsMen: string[], avatarsWomen?: string[]): PtUser {
    let genderBool = faker.random.boolean();
    let firstName = faker.name.firstName(genderBool ? 1 : 0);
    let lastName = faker.name.lastName(genderBool ? 1 : 0);
    let date = faker.date.past(1);
    var avatar;
    if (avatarsWomen) {
        avatar = genderBool ? _.sample(avatarsMen) : _.sample(avatarsWomen);
    } else {
        avatar = _.sample(avatarsMen);
    }

    let user: PtUser = {
        id: index + 1,
        fullName: firstName + ' ' + lastName,
        avatar: avatar,
        gender: genderBool ? GenderEnum.Male : GenderEnum.Female,
        dateCreated: date,
        dateModified: date
    };
    return user;
}

export function generateUser(index: number): PtUser {
    let genderBool = faker.random.boolean();
    let firstName = faker.name.firstName(genderBool ? 1 : 0);
    let lastName = faker.name.lastName(genderBool ? 1 : 0);
    let date = faker.date.past(1);

    const avatar = `app/images/avatars/${genderBool ? 'males' : 'females'}/image-${index + 1}.png`;

    let user: PtUser = {
        id: index + 1,
        fullName: firstName + ' ' + lastName,
        avatar: avatar,
        gender: genderBool ? GenderEnum.Male : GenderEnum.Female,
        dateCreated: date,
        dateModified: date
    };
    return user;
}

export function generateComments(users: Array<PtUser>): Array<PtComment> {
    let numComments = _.random(0, 5);
    let comments = _.times(numComments, (index: number) => {
        return generateComment(index, users);
    });
    return comments;
}

export function generateComment(index: number, users: Array<PtUser>): PtComment {
    let date = faker.date.past(1);
    let commentText = toTitleCase(faker.lorem.sentence(20, 40));

    let comment: PtComment = {
        id: index + 1,
        title: commentText,
        dateCreated: date,
        dateModified: date,
        user: _.sample(users)
    };
    return comment;
}

export function getUserAvatars(path) {
    const avatarList: Array<string> = [];

    const fileBuffer = fileSystemModule.readFileSync(path);
    const fileText = fileBuffer.toString();

    const lines = fileText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        avatarList.push('data:image/png;base64,' + lines[i]);
    }
    return avatarList;
}

