import React from 'react';


export const ReplicaBox = ({
    shipName,
    selectShip,
    availableShips,
    isCurrentlyPlacing
}) => {
    let ship = availableShips.find((item) => item.name === shipName);
    let shipLength = new Array(ship.length).fill('ship');
    let allBoxes = shipLength.map((item,index) => (
        <div className="smallBox" key = {index} />
    ));

    return(
        <div    
            id={`${shipName}-replica`}
            onClick={() => selectShip(shipName)}
            key={`${shipName}`}
            className={isCurrentlyPlacing ? "placing" : "replica"}
        >
            <div className="replicaTitle">{shipName}</div>
            <div className="replicaBoxes">{allBoxes}</div>
        </div>
    );
};