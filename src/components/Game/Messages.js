import React from 'react';

export const Messages = ({
    // gameState,
    hitsByPlayer,
    hitsByComputer,
    playAgain,
    winner
}) => {
    
    let numberOfSuccessfulHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;


    let gameOverMessage = (
        <div>
            <div className="gameOver">Game Over!</div>
            <p className="winnerMessage">
                {winner === 'player' ? 'Enemy lost all ships! You Win!' : 'You Lose, maybe next time'}
            </p>
            <p className="restart" onClick={playAgain}>
                Play Again?
            </p>
        </div>
    );

    let messagePanel = (
        <div>
            <div className="panel">Objective:</div>
            <p className="sink">Sink all 5 of the enemy's ships before they sink yours!</p>
            <p className="restart" onClick={playAgain}>Restart</p>
        </div>
    )

    return (
        <div id="messages">
            {numberOfSuccessfulHits === 17 || successfulComputerHits === 17
                ? gameOverMessage
                : messagePanel
            }
        </div>
    )

};