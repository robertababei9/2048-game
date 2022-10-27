import React, { useState } from 'react'
import GameOverlay from './GameOverlay';
import Cell from './Cell';
import Tile from './Tile';
import { Board } from '../helpers'
import useEvent from '../customHooks/useEvent';
import { useSwipeable } from 'react-swipeable';

const Direction = {
    Left: 37,
    Up: 38,
    Right:  39,
    Down: 40
}



export default function BoardView() {

    const [board, setBoard] = useState(new Board());

    const handleKeyDown = (event) => {
        console.log("here -> board.hasWon() = ", board.hasWon())
        if (board.hasWon()) {
            return
        }
        console.log("event = ", event)
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            let direction = event.keyCode - 37; // 0, 1, 2, 3
            let boardClone = Object.assign(
                Object.create(Object.getPrototypeOf(board)), board
            );

            let newBoard = boardClone.move(direction);
            setBoard(newBoard);
        }
    }
    useEvent('keydown', handleKeyDown);

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const tempEvent = {keyCode: Direction[eventData.dir]}

            handleKeyDown(tempEvent)
        },
      });

    const resetGame = () => {
         setBoard(new Board());
    }


    const cells = board.cells.map((row, rowIndex) => {
        return (
            <div key={rowIndex}>
                {row.map((col, colIndex) => {
                    return <Cell key={rowIndex * board.size + colIndex}/>
                })}
            </div>
        )
    })
    

    const tiles = board.tiles.filter(tile => tile.value != 0)
                    .map((tile, index) => <Tile key={index} tile={tile}/>);

    // console.log("board = ", board);
    // console.log("board.hasWon() = ", board.hasWon());
    // console.log("board.hasLost() = ", board.hasLost());
    

    return (
        <div >
            <div className='details-box'>
                <div className='resetButton' onClick={resetGame}>New Game</div>
                <div className='score-box'>
                    <div className='score-header'>SCORE</div>
                    <div>{board.score}</div>

                </div>
            </div>
            <div className='board' {...handlers}>
                {cells}
                {tiles}
                <GameOverlay onRestart={resetGame} board={board}/>

            </div>
        </div>
    )
}
