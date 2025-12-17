import NextPuzzle from "../components/NextPuzzle";

export default function Home() {
  return (
    <main className="flex flex-col gap-1">
      <h1 className="text-xl">PzChess</h1>
      <p>A chess puzzle trainer</p>
      <NextPuzzle />
    </main>
  );
}
