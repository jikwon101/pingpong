import '../../css/Game.css';
import MenuGame from '../../components/games/MenuGame';
import MenuChat from '../../components/chat/MenuChat';
import ChatRoom from '../../components/chat/ChatRoom';
import WaitingRoom from '../../pages/games/WaitingRoom';
import GameRoom from '../../pages/games/GameRoom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { useState } from 'react';
import { socket, user } from '../../socket/socket';

// type Friend = {
//     nick: string,
//     state: boolean
// }

// type User = {
//     id: string,
//     nick: string,
//     profile?: string,
//     friendList: Array<Friend>,
//     newFriendList?: Array<Friend>,
//     win: number,
//     lose: number
// }

export default function Game(){
    // const first :User = {
    //     id: 'ab',
    //     nick: 'first',
    //     profile: '../../icons/emoji-wink.svg',
    //     friendList: [{nick: 'first', state: true}, {nick: 'second', state: false}, {nick: 'second', state: false},{nick: 'second', state: false},{nick: 'second', state: false},{nick: 'second', state: false},{nick: 'second', state: false}, {nick: 'second', state: false},{nick: 'second', state: false},{nick: 'second', state: false}],
    //     newFriendList: [{nick: 'third', state: false}],
    //     win: 3,
    //     lose: 1
    // }

    let first = user;
    const [chatIdx, setIdx] = useState(-1);
    const getIdx = (idx :number) =>{
        setIdx(idx);
    }
    
    function handleBtn(){
        console.log("emit userInfo");
        socket.emit("userInfo");
    }

    return (
        <BrowserRouter>
            <h1 id='gameHeader'>PONG CONTEST GAME</h1>
            <div className='d-flex' id='gameContents'>
                <div id='gameTab'>
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-game-tab" data-bs-toggle="tab" data-bs-target="#nav-game" type="button" role="tab" aria-controls="nav-game" aria-selected="true">Game</button>
                            <button className="nav-link" id="nav-chat-tab" data-bs-toggle="tab" data-bs-target="#nav-chat" type="button" role="tab" aria-controls="nav-chat" aria-selected="false">Chat</button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-game" role="tabpanel" aria-labelledby="nav-game-tab">
                            <MenuGame profile={first.profile} id={first.id} nickname={first.nickname} friends={first.friends} newfriends={first.newfriends} win={first.win} lose={first.lose} level={first.level} levelpoint={first.levelpoint} levelnextpoint={first.levelnextpoint} blacklist={first.blacklist} />
                            <button onClick={handleBtn}>BTN</button>
                            {/* <MenuGame info={user} /> */}
                        </div>
                        <div className="tab-pane fade" id="nav-chat" role="tabpanel" aria-labelledby="nav-chat-tab">
                            {chatIdx === -1 ? <MenuChat nick={first.nickname} getIdx={getIdx}/> : <ChatRoom nick={first.nickname} idx={chatIdx} getIdx={getIdx}/>}
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path='/game/waiting'><WaitingRoom/></Route>
                    <Route path='/game/:id'><GameRoom/></Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
}