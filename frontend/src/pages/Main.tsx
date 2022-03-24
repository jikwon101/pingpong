import axios from "axios";
import { useContext, useEffect, useState } from "react";
import logo_brown from "../icons/logo_brown.png"
import { socket } from "../socket/userSocket";
import { GameContext } from "../socket/gameSocket";
import "./Main.css";

export default function Main(){
	const login:string = "/auth/login";
	const check:string = "/user/check";
	const {gameroom} = useContext(GameContext);
	const [nick, setNick] = useState<string>("");

	useEffect(()=>{
		axios.get(check + "?url=main").then((res:any)=>{
			// console.log("checked!");
			// console.log(res.state);
			if (res.state){
				console.log(res.state);
				if (res.state === "play" && gameroom[0].roomid){
					socket.emit("exitGameRoom", {
						roomid: gameroom[0].roomid,
					});
				}
			}
		}).catch((err)=>{
			console.log(err);
		})
	}, []);

	const handleInput = (event:any) => {
		setNick(event.target.value);
	}
	const handleTest = () => {
		console.log(nick);
		axios.post("/auth/force_login", {
			nickname: nick
		}).then((res)=>{
			if (res.data === true){
				window.location.href = "http://localhost:4242/game";
			}else {
				window.location.href = "http://localhost:4242/twofactor";
			}
		});
	}
	return (
		<div className="container text-center" id="main">
			<div className="col w-100">
				<img className="row mt-4" id="logo" src={logo_brown} alt="logo"/>
				<div className="row m-2">
					<input className="col mx-2" placeholder="nickname" onChange={handleInput}/>
					<div className="col btn btn-outline-primary mx-1" onClick={handleTest}>check</div>
				</div>
				<a className="row btn" id="loginButton" href={login} role="button">LOG IN</a>
			</div>
		</div>
	);
}