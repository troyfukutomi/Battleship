import React, {useState} from 'react';
import {GameBoard} from'./GameBoard';

import {
    placeComputerShips,
    SquareState,
    indexToCoords,
    putEntityInLayout,
    generateEmptyBoard,
    generateRandomIndex,
    getNeighbors,
    updateSunkShips,
    coordsToIndex
} from './LayoutHelpers';

const ships = [
    {
        name: 'Carrier',
        length: 5,
        placed: null
    },
    {
        name: 'Battleship',
        length: 4,
        placed: null
    },
    {
        name: 'Destroyer',
        length: 3,
        placed: null
    },
    {
        name: 'Submarine',
        length: 3,
        placed: null
    },
    {
        name: 'Patrol Boat',
        length: 2,
        placed: null
    }
];

const GamePage = () => {

    const [gameState, setGameState] = useState('placement');
    const [winner, setWinner] = useState(null);
    const [currentlyPlacing, setCurrentlyPlacing] = useState(null);
    const [placedShips, setPlacedShips] = useState([]);
    const [availableShips, setAvalableShips] = useState(ships);
    const [computerShips, setComputerShips] = useState([]);
    const [hitsByPlayer, setHitsByPlayer] = useState([]);
    const [hitsByComputer, setHitsByComputer] = useState([]);

    const selectShip = (shipName) => {
        let shipIndex = availableShips.findIndex((ship) => ship.name === shipName);
        const shipToPlace = availableShips[shipIndex];

        setCurrentlyPlacing({
            ...shipToPlace,
            orientation: 'horizontal',
            position: null,
        });
    };

    const placeShip = (currentlyPlacing) => {
        setPlacedShips([
            ...placedShips,
            {
                ...currentlyPlacing,
                placed: true
            },
        ]);
        setAvalableShips((previousShips) => 
            previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
        );
        setCurrentlyPlacing(null);
    };

    const rotateShip = (event) => {
        if (currentlyPlacing !== null && event.button === 2) {
            setCurrentlyPlacing({
                ...currentlyPlacing,
                orientation:
                    currentlyPlacing.orientation === 'vertical' ? 'horizontal' : 'vertical'
            });
        };
    };

    const startTurn = () => {
        generateComputerShips();

        setGameState('playerTurn');
    };

    const changeTurn = () => {
        setGameState((oldGameState) => 
            oldGameState === 'playerTurn' ? 'computerTurn' : 'playerTurn'
        );
    };

    const generateComputerShips = () => {
        let placedComputerShips = placeComputerShips(ships.slice());
        setComputerShips(placedComputerShips);
    };

    const computerFire = (index, layout) => {
        let computerHits;

        if (layout[index] === 'ship') {
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoords(index),
                    type: SquareState.hit
                }
            ];
        };

        if (layout[index] === 'empty') {
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoords(index),
                    type: SquareState.miss
                }
            ];
        };

        const sunkShips = updateSunkShips(computerHits, placedShips);
        
        setPlacedShips(sunkShips);
        setHitsByComputer(computerHits);
    };

    const handleComputerTurn =() => {
        changeTurn();
        if (checkIfGameOver()) {
            return;
        };

        let layout = placedShips.reduce(
            (prevLayout, currentShip) =>
                putEntityInLayout(prevLayout, currentShip, SquareState.ship),
                generateEmptyBoard()
        );

        layout = hitsByComputer.reduce(
            (prevLayout, currentHit) =>
                putEntityInLayout(prevLayout, currentHit, currentHit.type),
                layout
        );

        layout = placedShips.reduce(
            (prevLayout, currentShip) => 
                currentShip.sunk
                ? putEntityInLayout(prevLayout, currentShip, SquareState.sunk)
                : prevLayout, layout   
        );

        let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit');

        let nonSunkComputerHits = successfulComputerHits.filter((hit) =>{
            const hitIndex = coordsToIndex(hit.position);
            return layout[hitIndex] === 'hit';
        });

        let potentialTargets = nonSunkComputerHits
            .flatMap((hit) => getNeighbors(hit.position))
            .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

        if (potentialTargets.length === 0) {
            let layoutIndices = layout.map((item, idx) => idx);
            potentialTargets = layoutIndices.filter(
                (index) => layout[index] === 'ship' || layout[index] === 'empty'
            );
        };

        let randomIndex = generateRandomIndex(potentialTargets.length);
        let target = potentialTargets[randomIndex];

        setTimeout(() =>{
            computerFire(target, layout);
            changeTurn();
        }, 250);

    };

    const checkIfGameOver = () => {
        let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
        let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

        if ( successfulComputerHits === 17 || successfulPlayerHits === 17) {
            setGameState('gameOver');

            if(successfulPlayerHits === 17) {
                setWinner('player');
            };

            if (successfulComputerHits === 17) {
                setWinner('Computer');
            };
             
            return true;
        };
        return false;
    };

    const playAgain = () => {
        setGameState('placement');
        setWinner(null);
        setCurrentlyPlacing(null);
        setPlacedShips([]);
        setAvalableShips(ships);
        setComputerShips([]);
        setHitsByPlayer([]);
        setHitsByComputer([]);
        console.log(availableShips);
    };

    return(
        <GameBoard
            availableShips = {availableShips}
            selectShip = {selectShip}
            currentlyPlacing={currentlyPlacing}
            setCurrentlyPlacing={setCurrentlyPlacing}
            rotateShip={rotateShip}
            placeShip={placeShip}
            placedShips={placedShips}
            startTurn={startTurn}
            computerShips={computerShips}
            gameState={gameState}
            changeTurn={changeTurn}
            hitsByPlayer={hitsByPlayer}
            setHitsByPlayer={setHitsByPlayer}
            hitsByComputer={hitsByComputer}
            setHitsByComputer={setHitsByComputer}
            handleComputerTurn={handleComputerTurn}
            checkIfGameOver={checkIfGameOver}
            playAgain={playAgain}
            winner={winner}
            setComputerShips={setComputerShips}
        />
    )
}
export default GamePage;