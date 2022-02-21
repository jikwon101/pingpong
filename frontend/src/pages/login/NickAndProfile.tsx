import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./NickAndProfile.css";
import AlertModal from "../../components/modals/AlertModal";
import Profile from "../../components/login/ProfileCarousel";


export default function NickAndProfile(){
	const history = useHistory();
	const [profile, setProfile] = useState<number>(0);
	const [nickname, setNickname] = useState<string>("");
	const [checkModalText, setCheckModalText] = useState<string>("ERROR");
	const nicknamePlaceholder:string = "2~12 characters only";
	const btn = document.querySelector("#okBtn");
	const url = "http://localhost:4242";

	const handleInput = (event: any) => {
		setNickname(event.target.value);
		if (btn && !btn.getAttribute("data-toggle")){
			btn.setAttribute("data-toggle", "modal");
			btn.setAttribute("data-target", "#okModal");
			setCheckModalText("중복 확인 해주세요!");
		}
	}
	const handleCheck = (event : any) => {
		event.preventDefault();
		axios.get(`${url}/auth/check?nickname=${nickname}`)
		.then(res=>{console.log(res.data); setCheckModalText("사용 가능한 닉네임입니다.")})
		.catch(error=>{console.log(error); setCheckModalText("사용 불가능한 닉네임입니다.")});
		if (btn){
			btn.removeAttribute("data-toggle");
			btn.removeAttribute("data-target");
		}
	}
	const handleOK = (event: any) => {
		event.preventDefault();
		if (conditionals() === false){
			setCheckModalText("닉네임 중복 확인을 해주세요.");
			return ;
		}
		axios.post(`${url}/auth/signup`, { nickname, profile }, {withCredentials: true}
		).then(res=>{
			console.log(res);
			console.log(res.data);
			if (res.data){
				history.push("/game");
			}
		}).catch(err=>{
			console.error(err);
		});
	}
	const handleCancel = (event: any) => {
		event.preventDefault();
		history.push("/");
	}
	const conditionals = (): Boolean => {
		if (nickname === "")
			return false;
		else if (checkModalText !== "사용 가능한 닉네임입니다.")
			return false;
		return true;
	}

	return (
		<div id='nickandprofile'>
			<form>
				<Profile profile={profile} setProfile={setProfile}></Profile>
				<div className="d-flex my-2">
					<label className="m-2" id="nickLabel">Nickname</label>
					<input className="m-1" id="nickInput" placeholder={nicknamePlaceholder} onChange={handleInput} required />
					<button className="btn m-1" id="checkBtn" data-toggle="modal" data-target="#alertModal" onClick={handleCheck}>Check</button>
				</div>
				<div>
					<button className="btn m-1" id="okBtn" type="submit" data-toggle="modal" data-target="#alertModal" onClick={handleOK}>OK</button>
					<button className="btn m-1" id="cancelBtn" type="submit" onClick={handleCancel}>Cancel</button>
				</div>
				<AlertModal content={checkModalText}></AlertModal>
			</form>
		</div>
	);
}