import "../../css/Game.css"
import SideMenuChat from "../../components/chat/SideMenuChat"
import SideMenuGame from "./SideMenuGame"
import WaitingRoom from "./WaitingRoom"
import Lobby from "./Lobby"
import { Route, Switch } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { socket, UserContext, User } from "../../socket/userSocket"
import { GameContext, GameUser, match } from "../../socket/gameSocket"
import logo from "../../icons/logo_brown_profile.png"
import MatchRequestModal from "../../components/modals/MatchRequestModal"

import Modal from "react-modal"
Modal.setAppElement("#root");
export default function Game() {
	const history = useHistory();
	const gameContext = useContext(GameContext);
	const userContext = useContext(UserContext);
	const [user, setUser] = useState<User>(userContext.user[0]);
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [matchData, setMatch] = useState<match>();

	useEffect(() => {
		if (!user) {
			socket.emit("userInfo");
			console.log("user info !!!");
			socket.emit("myChatRoom");
		}
		socket.on("userInfo", (data) => {
			console.log("user Info is changed!");
			if (!user) {
				setUser(data);
			} else if (data.id) {
				user.userid = data.id;
			} else if (data.nickname) {
				user.nickname = data.nickname;
			} else if (data.win) {
				user.win = data.win;
			} else if (data.lose) {
				user.lose = data.lose;
			} else if (data.profile) {
				user.profile = data.profile;
			} else if (data.level) {
				user.level = data.level;
			} else if (data.levelpoint) {
				user.levelpoint = data.levelpoint;
			} else if (data.levelnextpoint) {
				user.levelnextpoint = data.levelnextpoint;
			} else if (data.friends) {
				user.friends = data.friends;
			} else if (data.newfriends) {
				user.newfriends = data.newfriends;
			} else if (data.blacklist) {
				user.blacklist = data.blacklist;
			}
			userContext.user[1](user);
		});
		socket.on("enterGameRoom", (msg) => {
			console.log("enter game room");
			console.log(msg);
			if (msg.message) {
				console.log(msg.message);
				alert("fail to enter the room!");
			}
			else {
				console.log("entered!")
				gameContext.gameroom[1](msg);
			}
		});
		socket.on("exitGameRoom", (msg) => {
			console.log(msg);
			gameContext.gameroom[1](undefined);
		});
		socket.on("startGame", (msg) => {
			console.log("start game!");
			if (msg.result) {
				alert("failed to play the game!");
			} else {
				gameContext.playroom[1](msg);
				history.push(`/game/play/${msg.roomid}`);
			}
		});
		socket.on("updateGameRoom", (msg) => {
			if (msg.manager) {
				gameContext.gameroom[0].manager = msg.manager;
			}
			if (msg.title) {
				gameContext.gameroom[0].title = msg.title;
			}
			if (msg.speed) {
				gameContext.gameroom[0].speed = msg.speed;
			}
			if (msg.status) {
				gameContext.gameroom[0].status = msg.status;
			}
			if (msg.type) {
				gameContext.gameroom[0].type = msg.type;
			}
			if (msg.addObserver) {
				msg.addObserver.forEach((observer: GameUser) => gameContext.gameroom[0].oberserver.push(observer))
			}
			if (msg.deleteObserver) {
				msg.deleteObserver.forEach((observer: GameUser) => gameContext.gameroom[0].observer.filter((ob: GameUser) => ob.userid === observer.userid))
			}
			if (msg.addPlayers) {
				msg.addPlayers.forEach((player: GameUser) => gameContext.gameroom[0].players.push(player))
			}
			if (msg.deletePlayers) {
				msg.deletePlayers.forEach((player: GameUser) => gameContext.gameroom[0].players.filter((person: GameUser) => person.userid === player.userid))
			}
		});
		socket.on("matchResponse", (data) => {
			setIsOpen(true);
			setMatch(data);
		})
	}, [user, userContext, gameContext, history]);
	return (
		<div className="container-fluid m-0 px-2" id="gamelobby">
			<div className="col h-100">
				<img className="row" id="gameLogo" src={logo} alt="header" />
				<div className="row m-0" id="gamePad">
					<div className="col-xs-12 col-md-4 col-lg-3 d-sm-none d-md-block">
						<Switch>
							<Route path="/game/chat" component={SideMenuChat}></Route>
							<Route path="/game" component={SideMenuGame}></Route>
						</Switch>
					</div>
					<div className="col d-none d-sm-block px-1">
						<Switch>
							<Route path="/game/waiting/:id" component={WaitingRoom}></Route>
							<Route path="/game/chat/:idx/waiting/:id" component={WaitingRoom}></Route>
							<Route path="/game/chat/waiting/:id" component={WaitingRoom}></Route>
							<Route path="/game" component={Lobby}></Route>
						</Switch>
					</div>
				</div>
			</div>
			<Modal isOpen={isOpen} style={customStyles}>
				<MatchRequestModal setIsOpen={setIsOpen} matchData={matchData} />
			</Modal>
		</div>
	);
}

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		padding: '0',
		transform: 'translate(-50%, -50%)',
		border: '1px solid #C9A641',
		borderRadius: '25px',
	},
};