import React from 'react';
import {ReplicaBox} from './ReplicaBox';
import './Game.css';

export const PlayerFleet = ({
    availableShips,
    selectShip,
    currentlyPlacing,
    startTurn,
    playAgain
}) => {
    let shipsLeft = availableShips.map((ship) => ship.name);

    let shipBoxes = shipsLeft.map((shipName) => (
        <ReplicaBox
            selectShip={selectShip}
            key={shipName}
            isCurrentlyPlacing={currentlyPlacing && currentlyPlacing.name === shipName}
            shipName={shipName}
            availableShips={availableShips}
        />
    ));

    let fleet =(
        <div id='replicaFleet'>
            {shipBoxes}
            <p className="panel">Place your fleet onto the board</p>
            <p className="panel">Right click to rotate ship before placement</p>
            <p className="restart" onClick={playAgain}>Restart</p>
        </div>
    );

    let playButton = (
        <div id="readyPlayer1">
            <p className="panel">Ready to attack. Awaiting Orders...</p>
            <button id="beginButton" onClick={startTurn}>Begin Game</button>
        </div>
    ); 

    return (
        <div id="availableShips">
            <div className="panelTitle">Your Fleet</div>
            {availableShips.length > 0 ? fleet : playButton}
        </div>
    );
};