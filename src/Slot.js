import React from "react";

export const Slot = ({filled, columnSelected, onClick, onHover,index}) => {
	let className = 'game-cell';
	className += filled > 0 ? ' filled' : '';
	className += columnSelected ? ' selected' : '';
	return <div className={className} onClick={onClick} onMouseEnter={onHover}>
		<div className={filled > 0 ? "coin" : ""} style={{background: filled === 1 ? "green": "blue"}}/>
	</div>;
};