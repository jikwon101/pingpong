import { useEffect, useState, useContext} from "react";
import {socket} from "../../socket/userSocket"
import { gameRoom, GameContext } from "../../socket/gameSocket"
import GameBox from "./GameBox"

export default function GameRoomSlide(props: any){
	const gameContext = useContext(GameContext);
	const [idx, setIdx] = useState<number>(0);
	const gameRoomList = gameContext.gameroomlist;
	let list: Array<gameRoom> = gameRoomList[0];

	useEffect(()=>{
		if (!gameRoomList[0]){
			console.log("game room list!")
			socket.emit("gameRoomList");
		}
		socket.on("gameRoomList", (msg:gameRoom)=>{
			console.log("socket on! gameRoomList in gmaeRoomSlide!")
			gameRoomList[1](msg);
		});
	}, [idx, gameRoomList, gameContext]);

	const handleButton = (num: number) => {
		if (num === 1 && (idx + 1) * 6 < list.length){
			setIdx(idx + 1);
		}else if (num === -1 && idx > 0){
			setIdx(idx - 1);
		}
	}
	const handleCarouselItem = () => {
		let i:number = idx * 6;
		let carousel = [];
		
		if (!list){
			return [];
		}
		for (;i < list.length; i++){
			if (i >= (idx * 6) + 6)
				break ;
			carousel.push(<GameBox key={`${list[i].roomid}box`} info={list[i]} idx={i}></GameBox>);
		}
		return carousel;
	}
	const handleSearchItem = () => {
		const searchRoom = gameRoomList[0];
		if (searchRoom && searchRoom.length > 0){
			gameRoomList[0].filter((room:gameRoom) => room.title.indexOf(props.search) !== -1);
		}
		list = searchRoom;
		return handleCarouselItem();
	}

	return (
		<div key="gameRoomSlide" className="container m-0 p-0">
			<div key="slideFirstCol" className="col">
				<div key="slide1Row" className="row mx-1 my-0">
					{props.search === "" ? handleCarouselItem() : handleSearchItem()}
				</div>
				<div key="slide2Row" className="row d-flex justify-content-center m-1">
					<span key="slidePrev" className="carousel-control-prev-icon shadow mx-5" aria-hidden="true" onClick={()=>handleButton(-1)}></span>
					<span key="slideNext" className="carousel-control-next-icon shadow mx-5" aria-hidden="true" onClick={()=>handleButton(1)}></span>
				</div>
			</div>
		</div>
	);
}