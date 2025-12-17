import NextPuzzle from "@/components/NextPuzzle";
import PuzzleBoard from "@/components/PuzzleBoard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Puzzle({
  params,
}: {
  params: Promise<{ puzzleId: string }>;
}) {
  const { puzzleId } = await params;
  const puzzle = await prisma.puzzle.findFirst({
    where: { id: puzzleId },
  });

  if (!puzzle) {
    return "Error: puzzle does not exist";
  }

  return (
    <main className="flex flex-col gap-1">
      <h1 className="text-xl">
        <Link href="/">PzChess</Link>
      </h1>
      <NextPuzzle />
      <PuzzleBoard puzzle={puzzle} />
    </main>
  );
}
