import {useContext, useEffect, useState} from "react"
import {socket} from "../../socket/userSocket"
import {ChatContext, chatRoom} from "../../socket/chatSocket"
import PublicChatList from "../chat/PublicChatList"

export default function PublicChatModal(){
	const [pwd, setPwd] = useState<string>("");
	const [checkedroom, checkRoom] = useState<string>("");
	const chatContext = useContext(ChatContext);
	const publicRoom = chatContext.publicroom;

	useEffect(() => {
		if (!publicRoom[0]){
			console.log("publicChatRoom");
			socket.emit("publicChatRoom");
		}
		socket.on("publicChatRoom", (data)=>{
			publicRoom[1](data);
		});
	}, [pwd, checkedroom, publicRoom]);

	function handleSubmit(){
		let data:any = {};
		data.chatid = checkedroom;
		if (pwd)
			data.password = pwd;
		socket.emit("enterChatRoom", data);
	}

	return (
		<div className="modal fade h-8" id="PublicChatModal" role="dialog" tabIndex={-1} aria-labelledby="PublicChatModalLabel" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 id="PublicChatModalLabel" className="modal-title">공개 채팅방</h5>
						<button type="button" className="btn modal-button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="container p-0">
							<div className="row overflow-scroll justify-content-center">
								{publicRoom[0] &&  publicRoom[0].chatroom?.map((room:chatRoom)=> <PublicChatList chatroom={room} setPwd={setPwd} checkRoom={checkRoom}/>)}
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn modal-button" data-dismiss="modal" onClick={handleSubmit}>확인</button>
						<button type="button" className="btn modal-button" data-dismiss="modal">취소</button>
					</div>
				</div>
			</div>
		</div>
	);
}