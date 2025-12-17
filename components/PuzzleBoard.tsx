"use client";

import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Color } from "chess.js";
import { puzzleModel } from "@/generated/prisma/models";

export default function PuzzleBoard({ puzzle }: { puzzle: puzzleModel }) {
  const moves = puzzle.moves.split(" ");
  const [game] = useState(() => new Chess(puzzle.fen));
  const [position, setPosition] = useState(game.fen());
  const [moveCount, setMoveCount] = useState(0);
  const [isPuzzleDone, setIsPuzzleDone] = useState(false);
  const [toMove, setToMove] = useState<Color>(game.turn());

  useEffect(() => {
    game.move(moves[0]);
    setPosition(game.fen());
    setMoveCount(1);
    setToMove(game.turn());
    console.log(moves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-1">
      <div className="flex-2">
        <Chessboard
          options={{
            position,
            allowDragging: !isPuzzleDone,
            boardOrientation: toMove === "w" ? "white" : "black",
            onPieceDrop({ sourceSquare, targetSquare }) {
              if (!targetSquare) {
                return false;
              }

              // TODO(miobi): handle promotion
              try {
                if (`${sourceSquare}${targetSquare}` !== moves[moveCount]) {
                  return false;
                }

                game.move({ from: sourceSquare, to: targetSquare });
                if (moveCount + 1 === moves.length) {
                  setIsPuzzleDone(true);
                } else {
                  game.move(moves[moveCount + 1]);
                  setMoveCount((prev) => prev + 2);
                }

                setPosition(game.fen());
                return true;
              } catch {
                return false;
              }
            },
          }}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg">Puzzle Info</h2>
        <p>
          Rating: {puzzle.rating} ± {puzzle.ratingDeviation}
        </p>
        <p>{toMove === "w" ? "White" : "Black"} to move</p>
        {isPuzzleDone && <p>Puzzle Completed!</p>}
      </div>
    </div>
  );
}
