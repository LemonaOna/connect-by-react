import React, {Component} from "react";
import {Slot} from "./Slot";
import {faLightbulb} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BOARD_COL_COUNT = 7;
const BOARD_ROW_COUNT = 6;

const INITIAL_STATE = {
	slots: Array(BOARD_COL_COUNT * BOARD_ROW_COUNT).fill(0),
	columnSelected: -1,
	player: 1,
	turn: 0,
	columnState: [],
	nextFree: -1,
	winningSet: [],
	winner: -1,
	gameActive: true
};

export class Main extends Component {

	constructor(props) {
		super(props);
		this.state = INITIAL_STATE
	}

	handleClick = (col) => {
		if(!this.state.gameActive){
			return;
		}
		const nextSlot = this.findNextFreeSlotForColumn(col);

		this.setState(state => {
			const newSlots = state.slots;
			newSlots[nextSlot] = state.player;
			const turn = state.turn++;

			return {
				slots: newSlots,
				player: turn % 2 > 0 ? 1 : 2,
				turn: state.turn++,
			}
		});


		const winningSet = this.checkWinningCondition(nextSlot);
		console.log(winningSet)
		console.log(this.state.slots)
		console.log(winningSet.map(e => this.state.slots[e]));
		if(winningSet.length > 0){
			this.setState(state => ({winningSet, winner: this.state.slots[winningSet[3]], gameActive: !state.gameActive}))
		}
	};

	handleHover = (columnSelected) => {
		if(!this.state.gameActive){
			return;
		}

		const nextFree = this.findNextFreeSlotForColumn(columnSelected);
		this.setState({columnSelected, nextFree});

	};

	clearState = () => {
		this.setState({
			slots: Array(BOARD_COL_COUNT * BOARD_ROW_COUNT).fill(0),
			columnSelected: -1,
			player: 1,
			turn: 0,
			columnState: [],
			nextFree: -1,
			winningSet: [],
			winner: -1,
			gameActive: true
		})
	};

	checkWinningCondition = (lastCoin) => {
		const {player, slots} = this.state;
		//checkUp ** not possible because last put coin

		//checkDown
		let verticalNeighbors = [lastCoin];

		for (let i = 1; i < 4; i++) {
			const nextNeighbor = lastCoin + i * (BOARD_ROW_COUNT + 1);
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT){
				if(slots[nextNeighbor] === player){
					verticalNeighbors.push(nextNeighbor);

					if(verticalNeighbors.length === 4) {
						return verticalNeighbors;
					}
				}

			}
		}
		//checkLeft
		let horizontalNeighbors = [lastCoin];
		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin - i;
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				horizontalNeighbors.push(nextNeighbor)

				if(horizontalNeighbors.length === 4) {
					return horizontalNeighbors;
				}
			}else{
				break;
			}
		}

		//checkRight
		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin + i;
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				horizontalNeighbors.push(nextNeighbor);

				if(horizontalNeighbors.length === 4) {
					return horizontalNeighbors;
				}
			}else{
				break;
			}
		}

		//checkDiagonaleUp
		let diagonaleNeighborsUp = [lastCoin];
		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin + (i * (BOARD_COL_COUNT - 1));
			console.log("up1", nextNeighbor);
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				console.log("filled",nextNeighbor)
				diagonaleNeighborsUp.push(nextNeighbor);

				if(diagonaleNeighborsUp.length === 4) {
					return diagonaleNeighborsUp;
				}
			}else{
				break;
			}
		}

		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin - (i * (BOARD_COL_COUNT - 1));
			console.log("up2", nextNeighbor);
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				diagonaleNeighborsUp.push(nextNeighbor);

				if(diagonaleNeighborsUp.length === 4) {
					return diagonaleNeighborsUp;
				}
			}else{
				break;
			}
		}

		let diagonaleNeighborsDown = [lastCoin];
		//checkDiagonaleDown
		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin - (i * (BOARD_COL_COUNT + 1 ));
			console.log("down1", nextNeighbor);
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				diagonaleNeighborsDown.push(nextNeighbor);

				if(diagonaleNeighborsDown.length === 4) {
					return diagonaleNeighborsDown;
				}
			}else{
				break;
			}
		}

		for(let i = 1; i < 4; i++){
			const nextNeighbor = lastCoin + (i * (BOARD_COL_COUNT + 1 ));
			console.log("down2", nextNeighbor);
			if(nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT && slots[nextNeighbor] === player){
				diagonaleNeighborsDown.push(nextNeighbor);

				if(diagonaleNeighborsDown.length === 4) {
					return diagonaleNeighborsDown;
				}
			}else{
				break;
			}
		}




		return []
	};

	findNextFreeSlotForColumn = (column) => {
		const cellsInColumn = Array.from(Array(BOARD_ROW_COUNT).fill(1), ((x, index) => (x * column) + (index * BOARD_COL_COUNT)));

		for (let cell of cellsInColumn.reverse()) {
			if (this.state.slots[cell] === 0) {
				return cell
			}
		}

		return -1

	};

	prepareHintCoins = () => {
		const {player, columnSelected} = this.state;

		const hintCoins = [];
		for (let i = 0; i < BOARD_COL_COUNT; i++) {
			hintCoins.push(
				<div className="hint-cell" key={i}>
					<div className="coin"
					     style={{
						     background: player === 1 ? 'green' : 'blue',
						     visibility: columnSelected === i ? 'visible' : 'hidden'
					     }}/>
				</div>)

		}
		return hintCoins
	};


	prepareSlots = () => {
		let slotHolder = [];
		for (let i = BOARD_COL_COUNT; i < BOARD_COL_COUNT * BOARD_ROW_COUNT + BOARD_COL_COUNT; i++) {
			const col = i % 7;
			const index = i - 7;
			const {slots, columnSelected} = this.state;
			slotHolder.push(
				<Slot key={i}
				      columnSelected={col === columnSelected}
				      filled={slots[index]}
				      index={index}
				      onClick={() => this.handleClick(col)}
				      onHover={() => this.handleHover(col)}/>)
		}

		return slotHolder
	};

	render() {

		const {player, turn, winningSet,winner, gameActive} = this.state;
		const winningBanner = {
			display: winningSet.length > 0 ? 'block' : 'none',
			position: "fixed",
			background: "rgba(200,200,200,0.7)",
			top: "50%",
			left:0,
			right:0,
			height:"40px",
			padding:"12px"
		};

		return (<div id="main">
			<div id="stats">
				<div style={{color: gameActive ? '#ffe32f' : 'grey'}}>
					<FontAwesomeIcon icon={faLightbulb}/>
				</div>
				<div>player:
					<span style={{color: player === 1 ? "green" : "blue"}}>
					{player}
					</span>
				</div>
				<div>turn: {turn}</div>
				<div style={winningBanner}>
					<span style={{color: winner === 1 ? "green" : "blue"}}>
					{winner} WINS!
					</span>
				</div>
			</div>
			<div id="game-board">
				{this.prepareHintCoins()}
				{this.prepareSlots()}
			</div>
			<div id="options">
				<button onClick={() => this.clearState()}>New Game</button>
			</div>
		</div>);
	}


}

