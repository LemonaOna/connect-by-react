import * as React from "react";
import { Slot } from "./Slot";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import coin1 from "./coin1.png";
import coin2 from "./coin2.png";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import {Player} from "./types/Player";

const BOARD_COL_COUNT = 7;
const BOARD_ROW_COUNT = 6;

const PLAYERS: Player[] = [
  {
    name: "playerA",
    coin: coin1,
    position: 1,
    color: "yellow",
    won: false,
  },
  {
    name: "playerB",
    coin: coin2,
    position: 2,
    color: "red",
    won: false,
  },
];

interface Props {}

interface ComponentState {
  slots: number[];
  columnSelected: number;
  player: Player;
  turn:number;
  columnState: any[];
  nextFree: number;
  winningSet: any[];
  winner: number;
  gameActive: boolean;
}

export class Main extends React.Component<Props,ComponentState> {
  state: ComponentState = {
    slots: Array(BOARD_COL_COUNT * BOARD_ROW_COUNT).fill(0),
    columnSelected: -1,
    player: PLAYERS[0],
    turn: 0,
    columnState: [],
    nextFree: -1,
    winningSet: [],
    winner: -1,
    gameActive: true,
  };

  handleClick = (col: number) => {
    if (!this.state.gameActive) {
      return;
    }
    const nextSlot = this.findNextFreeSlotForColumn(col);

    if (nextSlot === -1) {
      return;
    }

    this.setState((state) => {
      const newSlots = state.slots;
      newSlots[nextSlot] = state.player.position;

      return {
        slots: newSlots,
        player: state.turn % 2 > 0 ? PLAYERS[0] : PLAYERS[1],
        turn: state.turn + 1,
      };
    });

    const winningSet = this.checkWinningCondition(nextSlot);
    if (winningSet.length > 0) {
      this.setState({
        winningSet,
        winner: this.state.slots[winningSet[3]],
        gameActive: !this.state.gameActive,
      });
    }
  };

  resetTransition = () => {
    const selectedCoin: HTMLDivElement | null = document.querySelector(
      ".hint-cell .coin.selected"
    );
    if (selectedCoin) {
      selectedCoin.style.transition = "top 0.3s ease-in";
    }
  };

  handleHover = (columnSelected: number) => {
    if (!this.state.gameActive) {
      return;
    }

    const nextFree = this.findNextFreeSlotForColumn(columnSelected);
    this.setState({ columnSelected, nextFree });
  };

  clearState = () => {
    this.setState({
      slots: Array(BOARD_COL_COUNT * BOARD_ROW_COUNT).fill(0),
      columnSelected: -1,
      player: PLAYERS[0],
      turn: 0,
      columnState: [],
      nextFree: -1,
      winningSet: [],
      winner: -1,
      gameActive: true,
    });
  };

  checkWinningCondition = (lastCoin: number) => {
    const { player, slots } = this.state;

    //checkUp
    // ** not possible because last put coin

    //checkDown
    let verticalNeighbors = [lastCoin];

    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin + i * (BOARD_ROW_COUNT + 1);
      if (nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT) {
        if (slots[nextNeighbor] === player.position) {
          verticalNeighbors.push(nextNeighbor);

          if (verticalNeighbors.length === 4) {
            return verticalNeighbors;
          }
        }
      }
    }

    //checkLeft
    let horizontalNeighbors = [lastCoin];
    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin - i;
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        horizontalNeighbors.push(nextNeighbor);

        if (horizontalNeighbors.length === 4) {
          return horizontalNeighbors;
        }
      } else {
        break;
      }
    }

    //checkRight
    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin + i;
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        horizontalNeighbors.push(nextNeighbor);

        if (horizontalNeighbors.length === 4) {
          return horizontalNeighbors;
        }
      } else {
        break;
      }
    }

    //checkDiagonaleUp
    let diagonaleNeighborsUp = [lastCoin];
    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin + i * (BOARD_COL_COUNT - 1);
      console.log("up1", nextNeighbor);
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        console.log("filled", nextNeighbor);
        diagonaleNeighborsUp.push(nextNeighbor);

        if (diagonaleNeighborsUp.length === 4) {
          return diagonaleNeighborsUp;
        }
      } else {
        break;
      }
    }

    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin - i * (BOARD_COL_COUNT - 1);
      console.log("up2", nextNeighbor);
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        diagonaleNeighborsUp.push(nextNeighbor);

        if (diagonaleNeighborsUp.length === 4) {
          return diagonaleNeighborsUp;
        }
      } else {
        break;
      }
    }

    let diagonaleNeighborsDown = [lastCoin];

    //checkDiagonaleDown
    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin - i * (BOARD_COL_COUNT + 1);
      console.log("down1", nextNeighbor);
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        diagonaleNeighborsDown.push(nextNeighbor);

        if (diagonaleNeighborsDown.length === 4) {
          return diagonaleNeighborsDown;
        }
      } else {
        break;
      }
    }

    for (let i = 1; i < 4; i++) {
      const nextNeighbor = lastCoin + i * (BOARD_COL_COUNT + 1);
      console.log("down2", nextNeighbor);
      if (
        nextNeighbor <= BOARD_ROW_COUNT * BOARD_COL_COUNT &&
        slots[nextNeighbor] === player.position
      ) {
        diagonaleNeighborsDown.push(nextNeighbor);

        if (diagonaleNeighborsDown.length === 4) {
          return diagonaleNeighborsDown;
        }
      } else {
        break;
      }
    }

    return [];
  };

  findNextFreeSlotForColumn = (column: number) => {
    const cellsInColumn = Array.from(
      Array(BOARD_ROW_COUNT).fill(1),
      (x, index) => x * column + index * BOARD_COL_COUNT
    );

    for (let cell of cellsInColumn.reverse()) {
      if (this.state.slots[cell] === 0) {
        return cell;
      }
    }

    return -1;
  };

  prepareHintCoins = () => {
    const { player, columnSelected } = this.state;

    const hintCoins = [];
    for (let i = 0; i < BOARD_COL_COUNT; i++) {
      hintCoins.push(
        <div className="hint-cell" key={i}>
          <div
            className={`coin ${columnSelected === i ? "selected" : ""}`}
            style={{
              backgroundImage: `url(${player.coin})`,
            }}
          />
        </div>
      );
    }
    return hintCoins;
  };

  prepareSlots = () => {
    let slotHolder = [];
    for (
      let i = BOARD_COL_COUNT;
      i < BOARD_COL_COUNT * BOARD_ROW_COUNT + BOARD_COL_COUNT;
      i++
    ) {
      const col = i % 7;
      const index = i - 7;
      const { slots, columnSelected } = this.state;
      slotHolder.push(
        <Slot
          key={i}
          columnSelected={col === columnSelected}
          filled={slots[index]}
          noFree={this.findNextFreeSlotForColumn(columnSelected) === -1}
          players={PLAYERS}
          onClick={() => this.handleClick(col)}
          onHover={() => this.handleHover(col)}
        />
      );
    }

    return slotHolder;
  };

  render() {
    const { player, turn, winningSet, winner, gameActive } = this.state;

    return (
      <div id="main">
        <div id="stats">
          <div style={{ color: gameActive ? "#ffe32f" : "grey" }}>
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <div>
            next:
            <span>{this.state.gameActive ? " " + player.name : "-"}</span>
          </div>
          <div>turns: {turn}</div>
          <div
            id="winningBanner"
            style={{ display: winningSet.length > 0 ? "flex" : "none" }}
          >
            <div className="winning-coin">
              <img
                src={PLAYERS.find((e) => e.position === winner)?.coin}
                alt="winning coin color"
              />
            </div>
            <div>{PLAYERS.find((e) => e.position === winner)?.name} WINS!</div>
            <div className="winning-coin">
              <img
                src={PLAYERS.find((e) => e.position === winner)?.coin}
                alt="winning coin color"
              />
            </div>
          </div>
        </div>
        <div id="game-board">
          {this.prepareHintCoins()}
          {this.prepareSlots()}
        </div>
        <div id="options">
          <button onClick={() => this.clearState()}>
            <FontAwesomeIcon icon={faRedo} />
            &nbsp; restart
          </button>
        </div>
      </div>
    );
  }
}
