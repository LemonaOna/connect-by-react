import React from "react";

export const Slot = ({filled, noFree, columnSelected, onClick, onHover,index, players}) => {
	let className = 'game-cell';
	className += filled > 0 ? ' filled' : '';
	className += columnSelected ? ' selected' : '';
	className += noFree ? ' noFree' : '';
	return <div className={className} onClick={onClick} onMouseEnter={onHover}>
		<div className={filled > 0 ? "coin" : ""}
		     style={{backgroundImage: filled > 0 ? `url(${players[filled - 1].coin})` : 'none'}}/>
	</div>;
};