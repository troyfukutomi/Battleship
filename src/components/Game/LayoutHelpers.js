export const BoardRows = 10;
export const BoardColumns = 10;
export const Board = BoardRows * BoardRows;

export const SquareState = {
    empty: 'empty',
    ship:'ship',
    hit:'hit',
    miss:'miss',
    sunk:'sunk',
    forbidden:'forbidden',
    awaiting:'awaiting',
};

export const stateToClass = {
    [SquareState.empty]: 'empty',
    [SquareState.ship]:'ship',
    [SquareState.hit]:'hit',
    [SquareState.miss]:'miss',
    [SquareState.sunk]:'sunk',
    [SquareState.forbidden]:'forbidden',
    [SquareState.awaiting]:'awaiting',
}

export const generateEmptyBoard = () => {
    return new Array(BoardRows * BoardColumns).fill(SquareState.empty);
};

export const coordsToIndex = (coordinates) => {
    const { x, y } = coordinates;
  
    return y * BoardRows + x;
};
  
export const indexToCoords = (index) => {
    return {
      x: index % BoardRows,
      y: Math.floor(index / BoardRows),
    };
};

// Returns the indices that entity would take up
export const entityIndices = (entity) => {
    let position = coordsToIndex(entity.position);
  
    let indices = [];
  
    for (let i = 0; i < entity.length; i++) {
      indices.push(position);
      position = entity.orientation === 'vertical' ? position + BoardRows : position + 1;
    }
  
    return indices;
};

export const isWithinBounds = (entity) => {
    return (
      (entity.orientation === 'vertical' &&
        entity.position.y + entity.length <= BoardRows) ||
      (entity.orientation === 'horizontal' &&
        entity.position.x + entity.length <= BoardColumns)
    );
};

export const putEntityInLayout = (oldLayout, entity, type) => {
    let newLayout = oldLayout.slice();
  
    if (type === 'ship') {
      entityIndices(entity).forEach((idx) => {
        newLayout[idx] = SquareState.ship;
      });
    }
  
    if (type === 'forbidden') {
      entityIndices(entity).forEach((idx) => {
        newLayout[idx] = SquareState.forbidden;
      });
    }
  
    if (type === 'hit') {
      newLayout[coordsToIndex(entity.position)] = SquareState.hit;
    }
  
    if (type === 'miss') {
      newLayout[coordsToIndex(entity.position)] = SquareState.miss;
    }
  
    if (type === 'sunk') {
      entityIndices(entity).forEach((idx) => {
        newLayout[idx] = SquareState.sunk;
      });
    }
  
    return newLayout;
};

export const isSpaceFree = (entity, layout) => {
    let shipIndices = entityIndices(entity);

    return shipIndices.every((idx) => layout[idx] === SquareState.empty)
};

export const calculateOverhang = (entity) =>
  Math.max(
    entity.orientation === 'vertical'
      ? entity.position.y + entity.length - BoardRows
      : entity.position.x + entity.length - BoardColumns,
    0
);

export const canBePlaced = (entity, layout) =>
isWithinBounds(entity) && isSpaceFree(entity, layout);


export const placeComputerShips = (computerShips) => {
    let compLayout = generateEmptyBoard();

    return computerShips.map((ship) =>{
        while(true) {
            let decoratedShip = randomizeShipProps(ship);

            if (canBePlaced(decoratedShip, compLayout)) {
                compLayout = putEntityInLayout(compLayout, decoratedShip, SquareState.ship);
                return {...decoratedShip, placed: true};
            }
        }
    });
};

export const generateRandomOrientation = () => {
    let randomNumber = Math.floor(Math.random() * Math.floor(2));

    return randomNumber ===1 ? 'vertical': 'horizontal';
};

export const generateRandomIndex = (value = Board) => {
    return Math.floor(Math.random() * Math.floor(value));
};

export const randomizeShipProps = (ship) => {
    let randomStartIndex = generateRandomIndex();

    return{
        ...ship, position: indexToCoords(randomStartIndex), orientation: generateRandomOrientation(),
    };
};

export const placeComputerShipsInLayout = (ship, compLayout) => {
    let newComputerLayout = compLayout.slice();
    
    entityIndices(ship).forEach((idx) => {
        newComputerLayout[idx] = SquareState.ship;
    });
    
    return newComputerLayout;
};

// Gets the neighboring squares to a successful computer hit
export const getNeighbors = (coords) => {
    let firstRow = coords.y === 0;
    let lastRow = coords.y === 9;
    let firstColumn = coords.x === 0;
    let lastColumn = coords.x === 9;
  
    let neighbors = [];
  
    // coords.y === 0;
    if (firstRow) {
      neighbors.push(
        { x: coords.x + 1, y: coords.y },
        { x: coords.x - 1, y: coords.y },
        { x: coords.x, y: coords.y + 1 }
      );
    }
  
    // coords.y === 9;
    if (lastRow) {
      neighbors.push(
        { x: coords.x + 1, y: coords.y },
        { x: coords.x - 1, y: coords.y },
        { x: coords.x, y: coords.y - 1 }
      );
    }
    // coords.x === 0
    if (firstColumn) {
      neighbors.push(
        { x: coords.x + 1, y: coords.y }, // right
        { x: coords.x, y: coords.y + 1 }, // down
        { x: coords.x, y: coords.y - 1 } // up
      );
    }
  
    // coords.x === 9
    if (lastColumn) {
      neighbors.push(
        { x: coords.x - 1, y: coords.y }, // left
        { x: coords.x, y: coords.y + 1 }, // down
        { x: coords.x, y: coords.y - 1 } // up
      );
    }
  
    if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
      neighbors.push(
        { x: coords.x - 1, y: coords.y }, // left
        { x: coords.x + 1, y: coords.y }, // right
        { x: coords.x, y: coords.y - 1 }, // up
        { x: coords.x, y: coords.y + 1 } // down
      );
    }
  
    let filteredResult = [
      ...new Set(
        neighbors
          .map((coords) => coordsToIndex(coords))
          .filter((number) => number >= 0 && number < Board)
      ),
    ];
  
    return filteredResult;
};

export const updateSunkShips = (currentHits, opponentShips) => {
  
    let playerHitIndices = currentHits.map((hit) => coordsToIndex(hit.position));
  
    let indexWasHit = (index) => playerHitIndices.includes(index);
    let shipsWithSunkFlag = opponentShips.map((ship) => {
      let shipIndices = entityIndices(ship);
      
      if (shipIndices.every((idx) => indexWasHit(idx))) {
        return { ...ship, sunk: true };
      } else {
        return { ...ship, sunk: false };
      }
    });
    return shipsWithSunkFlag;
};