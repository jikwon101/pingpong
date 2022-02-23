import Lobby from "./Lobby"
import Modal from "react-modal"
import { Route, Switch, useHistory } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { socket, UserContext, User } from "../../socket/userSocket"
import { GameContext, GameUser, match } from "../../socket/gameSocket"
import WaitingRoom from "./WaitingRoom"
import SideMenuGame from "./SideMenuGame"
import SideMenuChat from "../../components/chat/SideMenuChat"
import MatchRequestModal from "../../components/modals/MatchRequestModal"

import "../../css/Game.css"
import logo from "../../icons/logo_brown_profile.png"

Modal.setAppElement("#root");
export default function Game() {
	const history = useHistory();
	const { gameroom, playroom } = useContext(GameContext);
	const { user } = useContext(UserContext);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [matchData, setMatch] = useState<match>();

	useEffect(() => {
		if (!user[0]) {
			console.log("user Info emit!")
			socket.emit("userInfo");
			socket.emit("myChatRoom");
		}
		socket.on("userInfo", (data:User) => {
			console.log("user Info is changed!");
			user[1](data);
		});
		socket.on("enterGameRoom", (msg:any) => {
			console.log("enter game room");
			if (msg.message) {
				alert("fail to enter the room!");
				//updateGameRoom에 대한 응답을 받은 경우
				//유저가 존재하지 않으면 로비로 이동
				if (history.location.pathname.search("waiting")){
					history.replace("/game");
				}
			}
			else {
				gameroom[1](msg);
				console.log("path = ", history.location.pathname);
				if (history.location.pathname.indexOf("waiting") === -1){
					history.push(`${history.location.pathname}/waiting/${msg.roomid}`);
				}
			}
			window.location.reload();
		});
		socket.on("exitGameRoom", () => {
			gameroom[1](undefined)
			history.push("/game");
		});
		socket.on("startGame", (msg:any) => {
			console.log("start game!");
			if (msg.result) {
				alert("failed to play the game!");
			} else {
				playroom[1](msg);
				history.push(`/game/play/${msg.roomid}`);
			}
		});
		socket.on("updateGameRoom", (msg:any) => {
			const tmp = gameroom[0];
			if (msg.manager) {
				tmp.manager = msg.manager;
			}
			if (msg.title) {
				tmp.title = msg.title;
			}
			if (msg.speed) {
				tmp.speed = msg.speed;
			}
			if (msg.status) {
				tmp.status = msg.status;
			}
			if (msg.type) {
				tmp.type = msg.type;
			}
			if (msg.addObserver) {
				msg.addObserver.map((observer: GameUser) => tmp.oberserver.push(observer))
			}
			if (msg.deleteObserver) {
				msg.deleteObserver.map((observer: GameUser) => tmp.observer = tmp.observer?.filter((ob: GameUser) => ob.userid === observer.userid))
			}
			if (msg.addPlayers) {
				msg.addPlayers.map((player: GameUser) => tmp.players.push(player))
			}
			if (msg.deletePlayers) {
				msg.deletePlayers.map((player: GameUser) => tmp.players = tmp.players?.filter((person: GameUser) => person.userid === player.userid))
			}
			gameroom[1](tmp);
			window.location.reload();
		});
		socket.on("matchResponse", (data:match) => {
			setIsOpen(true);
			setMatch(data);
		})
	}, []);
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