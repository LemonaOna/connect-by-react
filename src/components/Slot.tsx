import * as React from "react";
import { MouseEvent as ReactMouseEvent } from "react";
import {Player} from "../types/Player";

type SlotProps = {
  filled: number;
  noFree: boolean;
  columnSelected: boolean;
  onClick: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
  onHover: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
  players: Player[];
};

export const Slot = ({
  filled,
  noFree,
  columnSelected,
  onClick,
  onHover,
  players,
}: SlotProps) => {
  let className = "game-cell";
  className += filled > 0 ? " filled" : "";
  className += columnSelected ? " selected" : "";
  className += noFree ? " noFree" : "";
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      className={className}
    >
      <div className={filled > 0 ? "coin" : ""} style={{
        backgroundImage:
            filled > 0 ? `url(${players[filled - 1].coin})` : "none",
      }}/>
    </div>
  );
};
