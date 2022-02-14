import SideMenuPlay from "./SideMenuPlay"
import PlayRoom from "../../components/play/PlayRoom"
import logo from '../../icons/logo_brown_profile.png'

export default function Play(){
	return (
		<div className="container-fluid m-0 p-0 min-vh-100 min-vw-100" id="gamelobby">
			<div className="col">
				<img className="row" id="gameLogo" src={logo} alt="header"/>
				<div className="mx-1 row">
					<div className="col-md-4 col-lg-3 d-none d-sm-none d-md-block h-75">
						<SideMenuPlay></SideMenuPlay>
					</div>
					<div className="col">
						<PlayRoom></PlayRoom>
					</div>
				</div>
			</div>
		</div>
	);
}