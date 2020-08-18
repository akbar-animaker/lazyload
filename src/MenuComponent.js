import React, { Component, Suspense } from 'react';

// import DropMenu from '../containers/DropMenu';
// import SharePopup from '../containers/SharePopup';
// import PublishPopup from '../containers/PublishPopup';
import UndoRedo from '../components/undoRedoComponent';

import config from '../config/app.json';
import styled from 'styled-components'

import loadable from '@loadable/component'
const PublishPopup = loadable(() => import('../containers/PublishPopup'))
const DropMenu = loadable(() => import('../containers/DropMenu'))
const SharePopup = loadable(() => import('../containers/SharePopup'))

const Menu = styled.header`
	background-image: linear-gradient(130deg,#4db6cb,#9199fd);
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	box-sizing: border-box;
	height: ${props => props.Height}px
`

const MenuSection = styled.section`
	${props => 
		props.Section === 'left' && 
			`display: flex;
			align-items: center;
			height: 100%;`
	}
	
	${props => 
		props.Section === 'right' && 
			`display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 8px;
			height: 100%;`
	}
`

const MenuLogo = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	cursor: pointer;
	border-right: 1px solid #3ea4b9;
	height: 100%;
	width:${ (props)=> props.Width }px
`

const MenuOptionContainer = styled.div`
	display: flex;
`

export const MenuOption = styled.div`

	${props=>
		props.Type === 'image' &&
			`padding: 0 5px;`
	}

	${props=>
		(props.Type === 'input' || props.Type === 'undo' || props.Type === 'redo') &&
			`padding: 0 10px;`
	}
`

const MenuButtonWrap = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	position: relative;
`

const MenuButton = styled.button`
	background: #7e8be0;
	border: 2px solid transparent;
	color: #fff;
	margin: 0 5px;
	font-weight: 600;
	border-radius: 4px;
	font-size: 14px;
	cursor: pointer;
	display: flex;
	align-items: center;
	outline: none;
`

const MenuButtonSpan = styled.span`
	padding: 4px 8px;
`

export const MenuImage = styled.img`
	${props=>
		(props.Type === "tour") &&
			`width: 32px;
			height: 32px;
			cursor: pointer;`
	}
	
	${props=>
		(props.Type === "upgrade") &&
			`width: 12px;
			height: 12px;`
	}
	
	${props=>
		(props.Type === "arrow") &&
			`width: 16px;
			height: 16px;
			padding: 1px;`
	}
	
	${props=>
		(props.Type === "logo") &&
			`width: 34px;
			height: 34px;
			padding: 3px;
			background: rgba(0,0,0,0.15);
			border-radius: 3px;
			box-shadow: 0 0 0 0.5px rgba(255,255,255,0.5);`
	}

	${props=>
		(props.Type === "copy") &&
			`width: 25px;
			height: 25px;
			cursor: pointer;`
	}
	
	${props=>
		(props.Type === "undo" || props.Type === "redo") &&
			`width: 25px;
			height: 25px;
			cursor: pointer;`
	}
`

const SaveText = styled.div`
	color: #fff;
	font-size: 10px;
	font-style: italic;
`

const MenuInput = styled.input`
	background: transparent;
	border: none;
	font-size: 20px;
	font-weight: 700;
	font-family: PT Sans,sans-serif;
	color: #fff;
	outline: none;
`

class MenuComponent extends Component {
	constructor(props) {
		super(props);
		this.state = { projectName: props.projectName, isLoaded : props.isLoaded };
		this.changePname = this.changePname.bind(this);
		this.appUrl = config['APPICONS'][config['APPICONS']['current']];
	}

	componentDidMount() {

		// const Components = ["DropMenu", "SharePopup", "PublishPopup"]
		
		// Components.forEach((component, index) => {
		// 	console.log(component);

		// 	require(`../containers/${component}`).then(Component =>{
		// 		this.setState({ 
		// 			[component]: Component.default
		// 		})
		// 	})
		// })

		// require('../components/undoRedoComponent').then(UndoRedo => {
		// 	this.setState({ 
		// 		UndoRedo: UndoRedo.default
		// 	})
		// })

	}

	static getDerivedStateFromProps(props, state) {
		let toReturn = {};
		
		if (props.isLoaded !== state.isLoaded) {

			toReturn.projectName = props.projectName

		}
		
		return toReturn;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.shortcutName !== prevProps.shortcutName && this.props.shortcutName !== "")
			this.handleShortcuts(this.props.shortcutName);
	}

	handleShortcuts(option) {
		switch (option) {
			case "EXPORT_PROJECT":
			case "EXPORT_PROJECT_AGAIN":
				// this.openExportPopup();
				break;

			case "UNDO_PROJECT":
			case "UNDO_PROJECT_AGAIN":

				if(this.props.canUndo)
					this.props.undo()

				break;

			case "REDO_PROJECT":
			case "REDO_PROJECT_AGAIN":

				if(this.props.canRedo)
					this.props.redo()

				break;

			default:
				break;
		}
	}

	changePname(e) {
		this.setState({ projectName: e.target.value })
	}

	render() {

		// const { DropMenu, SharePopup, PublishPopup, UndoRedo } = this.state

		return (
			<Menu Height={this.props.layout.getIn(["menu", "height"])}>
				<MenuSection Section={"left"}>
					<MenuLogo Width={this.props.layout.getIn(["library", "inner"])}>
						<MenuImage Type="logo" alt="PicMaker" src={this.appUrl + "logo.svg"} />
						<MenuImage
							Type="arrow"
							alt="menu-arrow"
							src={this.appUrl + "drop-down.svg"}
							onClick={(e) => {
								this.props.toggleDropMenu();
							}}
						></MenuImage>

						{this.props.dropMenu ? (
							<Suspense
								fallback={
									<div
										style={{
											position: "absolute",
											top: "48px",
											left: "5px",
											zIndex: 3,
										}}
										className="loader-ellipsis"
									>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>
								}
							>
								<DropMenu/>
								{/* { DropMenu && <DropMenu/> } */}
							</Suspense>
						) : null}
					</MenuLogo>

					<MenuOptionContainer>
						{ UndoRedo && <UndoRedo
							appUrl={this.appUrl}
							undo={this.props.undo}
							redo={this.props.redo}
							canUndo={this.props.canUndo}
							canRedo={this.props.canRedo}
						/> }

						<MenuOption Type={"image"}>
							<MenuImage
								Type={"copy"}
								src={this.appUrl + "copy-active.svg"}
								onMouseEnter={(e) =>
									(e.currentTarget.src = this.appUrl + "copy.svg")
								}
								onMouseOut={(e) =>
									(e.currentTarget.src = this.appUrl + "copy-active.svg")
								}
								alt="Copy"
							/>
						</MenuOption>
					</MenuOptionContainer>

					<MenuOption Type={"input"}>
						<MenuInput
							type="text"
							onChange={this.changePname}
							value={this.state.projectName}
						/>
						<SaveText>{this.props.projectSaveMessage}</SaveText>
					</MenuOption>
				</MenuSection>

				<MenuSection Section={"right"}>
					<MenuButton>
						<MenuImage
							Type={"upgrade"}
							alt="Upgrade"
							src={this.appUrl + "upgrade-1.svg"}
						/>
						<MenuButtonSpan>Upgrade to Pro</MenuButtonSpan>
					</MenuButton>

					<MenuButtonWrap>
						<MenuButton
							onClick={(e) => {
								this.props.toggleSharePopup();
							}}
						>
							<MenuButtonSpan>Share</MenuButtonSpan>
						</MenuButton>
						{this.props.sharePopup ? (
							<Suspense
								fallback={
									<div
										style={{ position: "absolute", top: "48px", zIndex: 3 }}
										className="loader-ellipsis"
									>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>
								}
							>
								<SharePopup/>
								{/* { SharePopup && <SharePopup/>} */}
							</Suspense>
						) : null}
					</MenuButtonWrap>

					<MenuButtonWrap>
						<MenuButton
							onClick={(e) => {
								this.props.togglePublishPopup();
							}}
						>
							<MenuButtonSpan>Publish</MenuButtonSpan>
						</MenuButton>

						{this.props.publishPopup ? (
							<Suspense
								fallback={
									<div
										style={{ position: "absolute", top: "48px", zIndex: 3 }}
										className="loader-ellipsis"
									>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>
								}
							>
								<PublishPopup/>
								{/* { PublishPopup && <PublishPopup/>} */}
							</Suspense>
						) : null}
					</MenuButtonWrap>

					<MenuImage
						Type={"tour"}
						src={this.appUrl + "tour.svg"}
						onMouseEnter={(e) =>
							(e.currentTarget.src = this.appUrl + "tour-active.svg")
						}
						onMouseOut={(e) => (e.currentTarget.src = this.appUrl + "tour.svg")}
						alt="Tour"
					/>
				</MenuSection>
			</Menu>
		);
	}
}

export default MenuComponent;