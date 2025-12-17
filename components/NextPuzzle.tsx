import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function NextPuzzle() {
  await connection();
  // eslint-disable-next-line react-hooks/purity
  const randomSeed = Math.random();

  const puzzleCount = await prisma.puzzle.count();
  const skip = Math.floor(randomSeed * puzzleCount);
  const data = await prisma.puzzle.findFirst({
    skip,
    orderBy: {
      id: "asc",
    },
  });

  const puzzle = data!;
  return (
    <a
      className="border border-zinc-500 p-2 mr-auto"
      href={`/puzzle/${puzzle.id}`}
    >
      Next Puzzle
    </a>
  );
}
