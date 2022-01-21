import { useEffect, useState, useContext } from 'react'
import '../../css/MenuPlay.css'
import Profile from '../../icons/Profile'
import {GameContext, gameRoomDetail, User} from '../../socket/gameSocket'

export default function MenuPlay(props:any){
	const gameContext = useContext(GameContext);
	const gameroom:gameRoomDetail = gameContext.gameroom[0];
	const p1 = gameroom?.players.find((p:User)=> p.userid === gameContext.playroom[0].player1);
	const p2 = gameroom?.players.find((p:User)=> p.userid === gameContext.playroom[0].player2);
	const [s1, setS1] = useState<number>(5);
	const [s2, setS2] = useState<number>(0);
	
	useEffect(()=>{
		console.log('menu play');
	}, [s1, s2, gameContext]);
	const profileBox = (id:string, profile:string, nick:string, player:boolean) => {
		return (
			<div className={`m-1 ${player ? 'player':'observer'}`} id={id}>
				<img className="row mx-auto img-fluid img-thumbnail" src={profile} alt={id}></img>
				<label className={`row justify-content-center my-1 ${player ? 'h4':'h6'}`}>{nick}</label>
			</div>
		);
	}
	return (
		<div className="container m-1 p-2" id="menu">
			<div className="col">
				<div className="row align-items-center">
					<div className="col">
						<img src={Profile(p1 ? p1.profile : 0)} className="my-4" alt="player1" id="player1"/>
						<label className="h4">{p1?.nickname}</label>
					</div>
					<div className="col h3">VS</div>
					<div className="col">
						<img src={Profile(p2 ? p2.profile : 0)} className="my-4" alt="player2" id="player2"/>
						<label className="h4">{p2?.nickname}</label>
					</div>
				</div>
				<label className="row mx-3 my-2 justify-content-center" id="menuScore">SCORE</label>
				<div className="row justify-content-center" id="winLose">{s1} : {s2}</div>
				<div className="row mt-5 justify-content-center">
					<div className="col mx-1" id="observer">{gameroom?.observer[0] ? profileBox(gameroom.observer[0].userid, Profile(gameroom.observer[0].profile), gameroom.observer[0].nickname, false):''}</div>
					<div className="col mx-1" id="observer">{gameroom?.observer[1] ? profileBox(gameroom.observer[1].userid, Profile(gameroom.observer[1].profile), gameroom.observer[1].nickname, false):''}</div>
					<div className="col mx-1" id="observer">{gameroom?.observer[2] ? profileBox(gameroom.observer[2].userid, Profile(gameroom.observer[2].profile), gameroom.observer[2].nickname, false):''}</div>
				</div>
				<div className="row my-5 justify-content-center">
					<div className="col mx-3" id="observer">{gameroom?.observer[3] ? profileBox(gameroom.observer[3].userid, Profile(gameroom.observer[3].profile), gameroom.observer[3].nickname, false):''}</div>
					<div className="col mx-3" id="observer">{gameroom?.observer[4] ? profileBox(gameroom.observer[4].userid, Profile(gameroom.observer[4].profile), gameroom.observer[4].nickname, false):''}</div>
				</div>
			</div>
		</div>
	);
}