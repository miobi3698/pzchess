"use client";

import { useEffect, useState } from "react";
import { Chessboard, defaultPieces, PieceRenderObject } from "react-chessboard";
import { Chess, Color, PieceSymbol } from "chess.js";
import { puzzleModel } from "@/generated/prisma/models";

export default function PuzzleBoard({ puzzle }: { puzzle: puzzleModel }) {
  const moves = puzzle.moves.split(" ");
  const [game] = useState(() => new Chess(puzzle.fen));
  const [position, setPosition] = useState(game.fen());
  const [moveCount, setMoveCount] = useState(0);
  const [isPuzzleDone, setIsPuzzleDone] = useState(false);
  const [toMove, setToMove] = useState<Color>(game.turn());
  const [promotionSquare, setPromotionSquare] = useState<{
    from: string;
    to: string;
  } | null>(null);

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
      <div className="flex-2 relative">
        <div
          hidden={promotionSquare === null}
          className="flex z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {(["q", "r", "b", "n"] as PieceSymbol[]).map((piece) => (
            <button
              key={piece}
              className="w-25 bg-background"
              onClick={() => {
                const { from, to } = promotionSquare!;

                try {
                  const expect = moves[moveCount];
                  const actual = `${from}${to}${piece}`;
                  if (expect !== actual) {
                    setPromotionSquare(null);
                    return false;
                  }

                  game.move({
                    from,
                    to,
                    promotion: piece,
                  });
                  if (moveCount + 1 === moves.length) {
                    setIsPuzzleDone(true);
                  } else {
                    game.move(moves[moveCount + 1]);
                    setMoveCount((prev) => prev + 2);
                  }

                  setPosition(game.fen());
                  setPromotionSquare(null);
                  return true;
                } catch {
                  setPromotionSquare(null);
                  return false;
                }
              }}
            >
              {defaultPieces[
                `w${piece.toUpperCase()}` as keyof PieceRenderObject
              ]()}
            </button>
          ))}
        </div>
        <Chessboard
          options={{
            position,
            allowDragging: !isPuzzleDone,
            boardOrientation: toMove === "w" ? "white" : "black",
            onPieceDrop({ piece, sourceSquare, targetSquare }) {
              if (!targetSquare) {
                return false;
              }

              const shouldPromote =
                (piece.pieceType === "wP" && targetSquare[1] === "8") ||
                (piece.pieceType === "bP" && targetSquare[1] === "1");
              if (shouldPromote) {
                setPromotionSquare({ from: sourceSquare, to: targetSquare });
                return true;
              }

              try {
                const expect = moves[moveCount];
                const actual = `${sourceSquare}${targetSquare}`;
                if (expect !== actual) {
                  return false;
                }

                game.move({
                  from: sourceSquare,
                  to: targetSquare,
                });
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
