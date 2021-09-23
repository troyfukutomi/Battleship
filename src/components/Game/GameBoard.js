import React from 'react';
import {PlayerFleet} from './PlayerFleet';
import {PlayerBoard} from './PlayerBoard';
import {ComputerBoard} from './ComputerBoard';
import {Messages} from './Messages';

 export const GameBoard = ({
    availableShips,
    selectShip,
    currentlyPlacing,
    setCurrentlyPlacing,
    rotateShip,
    placeShip,
    placedShips,
    startTurn,
    computerShips,
    gameState,
    changeTurn,
    hitComputer,
    hitsByPlayer,
    setHitsByPlayer,
    hitsByComputer,
    handleComputerTurn,
    checkIfGameOver,
    winner,
    playAgain,
    setComputerShips,
}) => {
    return (
        <section id="gameScreen">
            {gameState !== 'placement' ? (
                <Messages
                   gameState={gameState}
                   hitsByPlayer={hitsByPlayer} 
                   hitsByComputer={hitsByComputer}
                   winner={winner}
                   playAgain={playAgain}
                />
            ) : (
                <PlayerFleet
                    availableShips={availableShips}
                    selectShip={selectShip}
                    currentlyPlacing={currentlyPlacing}
                    startTurn={startTurn}
                    playAgain={playAgain}
                />    
            )}

            <PlayerBoard
                currentlyPlacing={currentlyPlacing}
                setCurrentlyPlacing={setCurrentlyPlacing}
                rotateShip={rotateShip}
                placeShip={placeShip}
                placedShips={placedShips}
                hitsByComputer={hitsByComputer}
            />
            <ComputerBoard
                computerShips={computerShips}
                changeTurn={changeTurn}
                gameState={gameState}
                hitComputer={hitComputer}
                hitsByPlayer={hitsByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
                setComputerShips={setComputerShips}
            />    
        </section>
    );
};