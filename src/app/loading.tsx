import PokemonCardSkeleton from "@/components/page/PokemonCardSkeleton";

const SKELETON_COUNT = 10;

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
