import React from 'react';
import {ReplicaBox} from './ReplicaBox';



export const getReplicaShip = (availableShips, shipName, selectShip) =>{
    let ship = availableShips.find((item) => item.name === shipName);
    let shipLength = new Array(ship.length).fill('ship');

    let allReplicaBoxes = shipLength.map((item,index) => (
        <div className="smallBox" key={index} />
    ));

    return (
        <ReplicaBox
            key={shipName}
            selectShip={selectShip}
            shipName={shipName}
            boxes={allReplicaBoxes}
        />
    );
};
