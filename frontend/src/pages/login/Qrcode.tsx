import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import "./qrcode.css";
import {socket, User, UserContext} from "../../context/userContext";
import {GameContext, gameRoomDetail} from "../../context/gameContext";
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';

export default function Qrcode(){
	// const back_url:string = "http://localhost:4242";
	const back_url:string = "";
	const history = useHistory();
	const [token, setToken] = useState<string>("");
	const [alertState, setAlert] = useState<boolean>(false);
	const checkUrl:string = back_url + "/user/check";
	// const {user} = useContext(UserContext);
	// const { gameroom } = useContext(GameContext);
	// const dispatch = useDispatch();
	// const user:User = useSelector((state:RootState) => state.userReducer, shallowEqual);
	const gameroom:gameRoomDetail = useSelector((state:RootState) => state.gameReducer.gameroom, shallowEqual);

	useEffect(()=>{
		axios.get(checkUrl).then((res:any)=>{
			if (res.state){
				console.log(res.state)
				if (res.state === "play" && gameroom.roomid){
					socket.emit("exitGameRoom", { roomid: gameroom.roomid });
				}else if (res.state === "logout"){ history.replace("/") }
			}
		}).catch((err)=>{
			console.log(err);
			history.push("/");
		})
	}, []);
	const checkToken = ():boolean => {
		if (token.length !== 6){
			return false;
		}
		for (let i = 0; i < token.length; i++){
			if (isNaN(parseInt(token[i]))){return false;}
		}
		return true;
	}
	const handleChange = (event:any) => {
		setToken(event.target.value);
	}
	function handleSubmit(){
		if (!checkToken()){
			setAlert(true);
		}else {
			const auth:string = back_url + "/2fa/authenticate";
			axios.post(auth, { twoFactorAuthenticationCode: token }).then((res:any)=>{
				console.log(res);
				history.push("/game");
			}).catch((err:any)=>{	setAlert(true);})
		}
	}
	function handleKeypress(event: any){
		if (event.code === 'Enter'){ handleSubmit() }
	}

	return (
		<div id="qrcode" className="container">
			<div className="col-10 col-md-8 col-lg-4" id="qrborder">
				<h1 className="row mt-2 p-1" id="qrtitle">2중 인증</h1>
				<h5 className="row justify-content-center">Google OTP 숫자를 입력해주세요.</h5>
				<div className="row m-1 mt-4">
					<input className="col-8" id="qrinput" placeholder="OTP Number without space." onChange={handleChange} onKeyPress={handleKeypress}></input>	
					<div className="col btn m-1" id="qrbutton" onClick={handleSubmit}>확인</div>
				</div>
				<div className="row mt-1">
					{ !alertState ? "" :
						<div className="alert alert-danger m-1" role="alert">OTP 숫자를 다시 확인해주세요! ex) 123456, ...</div>
					}	
				</div>
			</div>
		</div>
	);
}