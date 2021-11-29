import {io} from "socket.io-client";

export const socket = io();

export type Friend = {
    userid?: string,
    nickname: string,
    profile: number,
    onoff: boolean,
}
export type History = {
    nickname: string,
    profile: number,
    winner: string,
}
export type User = {
    id: string,
    nickname: string,
    win: number,
    lose: number,
    profile: number,
    level: string,
    levelpoint: number,
    levelnextpoint: number,
    friends: Array<Friend>,
    newfriends: Array<Friend>,
    blacklist: Array<Friend>,
    // history?: Array<History>,
}

// export let user: User = {
//     nickname: `${socket}`,
//     win: 0,
//     lose: 0,
//     profile: 0,
//     level: "",
//     levelpoint: 0,
//     levelnextpoint: 100,
//     friends: [],
//     newfriends: [],
//     blacklist: [],
//     history: [],
// };

export let user: User = {
    id: `${socket}`,
    nickname: 'first_user',
    win: 3,
    lose: 2,
    profile: 1,
    level: "",
    levelpoint: 0,
    levelnextpoint: 100,
    friends: [{nickname: 'first', profile: 1, onoff: true}, {nickname: 'second', profile: 2, onoff: false}, {nickname: 'third', profile: 0, onoff: false},{nickname: 'forth', profile: 3, onoff: false},{nickname: 'fifth', profile: 4, onoff: false}],
    newfriends: [{nickname: 'newbie', profile: 2, onoff: false}],
    blacklist: [],
    // history: [],
};

socket.on("userInfo", (data)=>{
    console.log("user Info is changed!");
    if (data.nickname)
        user.nickname = data.nickname;
    if (data.win)
        user.win = data.win;
    if (data.lose)
        user.lose = data.lose;
    if (data.profile)
        user.profile = data.profile;
    if (data.level)
        user.level = data.level;
    if (data.levelpoint)
        user.levelpoint = data.levelpoint;
    if (data.levelnextpoint)
        user.levelnextpoint = data.levelnextpoint;
    if (data.friends)
        user.friends = data.friends;
    if (data.newfriends)
        user.newfriends = data.newfriends;
    if (data.blacklist)
        user.blacklist = data.blacklist;
    // if (data.history)
        // user.history = data.history;
});
socket.on("newFriend", (data)=>{
    user.newfriends.push(data);
});
socket.on("addFriend", (data)=>{
    user.friends.push(data);
});
socket.on("deleteFriend", (data)=>{
    //userid 가 동일한 친구를 제거한다.
    user.friends = user.friends.filter(friend=>friend.userid !== data.userid);
});
socket.on("blockFriend", (data)=>{
    user.blacklist.push(data);
});
socket.on("updateProfile", (data)=>{
    if (data.nickname)
        user.nickname = data.nickname;
    if (data.profile)
        user.profile = data.profile;
});
socket.on("opponentProfile", (data)=>{
    //친구 정보를 popup으로 보여줌!
});
//game
socket.on("matchRequest", (data)=>{
    //대전 신청 결과를 받음
    //대기 상태 종료
});
socket.on("matchResponse", (data)=>{
    //대전신청을 받음
    //popup 띄워서 수락 여부 결정해야 한다.
});