"use client";

import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function Home() {
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());

  return (
    <main>
      <h1 className="text-xl">PzChess</h1>
      <Chessboard
        options={{
          position,
          onPieceDrop({ sourceSquare, targetSquare }) {
            if (!targetSquare) {
              return false;
            }

            try {
              game.move({ from: sourceSquare, to: targetSquare });
              setPosition(game.fen());
              return true;
            } catch {
              return false;
            }
          },
        }}
      />
    </main>
  );
}
