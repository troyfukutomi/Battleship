import React from 'react';
import {
    stateToClass,
    generateEmptyBoard,
    putEntityInLayout,
    SquareState,
    indexToCoords,
    updateSunkShips
} from './LayoutHelpers';

 export const ComputerBoard = ({
    computerShips,
    gameState,
    hitsByPlayer,
    setHitsByPlayer,
    handleComputerTurn,
    checkIfGameOver,
    setComputerShips
    }) => {

    let computerLayout = computerShips.reduce(
        (prevLayout, currentShip) => 
            putEntityInLayout(prevLayout, currentShip, SquareState.ship),
        generateEmptyBoard()
    );

    computerLayout = hitsByPlayer.reduce(
        (prevLayout, currentHit) => 
        putEntityInLayout(prevLayout, currentHit, currentHit.type), computerLayout
    );

    computerLayout= computerShips.reduce(
        (prevLayout, currentShip) =>
            currentShip.sunk
            ? putEntityInLayout(prevLayout, currentShip, SquareState.sunk)
            : prevLayout,
        computerLayout
    );

    const fire = (index) => {
        if (computerLayout[index] === 'ship') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(index),
                    type: SquareState.hit
                }
            ];
            setHitsByPlayer(newHits);
            return newHits;
        };

        if (computerLayout[index] === 'empty') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(index),
                    type: SquareState.miss,
                }
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }

    };

    const playerTurn  = gameState === 'playerTurn';
    const playerCanFire = playerTurn && !checkIfGameOver();

    let alreadyHit = (index) => 
        computerLayout[index] === 'hit' ||
        computerLayout[index] === 'miss' ||
        computerLayout[index] === 'shipSunk';

    let computerSquares = computerLayout.map((square, index) => {
        return (
            <div
                className={
                    stateToClass[square] === 'hit' ||
                    stateToClass[square] === 'miss' ||
                    stateToClass[square] === 'sunk'
                    ? `square ${stateToClass[square]}`
                    : `square`
                }
                key={`comp-square-${index}`}
                id={`comp-square-${index}`}
                onClick={() => {
                    if (playerCanFire && !alreadyHit(index)) {
                        const newHits = fire(index);
                        const shipsWithSunkFlag = updateSunkShips(newHits, computerShips);
                        setComputerShips(shipsWithSunkFlag);
                        handleComputerTurn();
                    }
                }}
            />
        );
    });

    return (
        <div>
            <h2 className="playerTitle">Computer</h2>
            <div className="board">{computerSquares}</div>
        </div>
    );
    
};
// export default ComputerBoard;