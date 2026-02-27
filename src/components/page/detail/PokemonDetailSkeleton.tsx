function Bone({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
  );
}

export default function PokemonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      {/* Back nav */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <Bone className="h-4 w-32" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          {/* ── LEFT PANEL ─────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Art card */}
            <div className="flex items-center justify-center rounded-3xl border border-white/5 bg-[#1a1a2e] p-8 pt-10">
              <Bone className="h-[260px] w-[260px] rounded-2xl" />
            </div>

            {/* Name block */}
            <div className="flex flex-col items-center gap-3">
              <Bone className="h-3 w-12" />
              <Bone className="h-9 w-48" />
              <Bone className="h-3 w-28" />
              <div className="mt-1 flex gap-2">
                <Bone className="h-6 w-16 rounded-full" />
                <Bone className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Flavor text + info cards */}
            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <Bone className="mb-2 h-3 w-full" />
              <Bone className="mb-5 h-3 w-4/5" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-xl bg-white/5 p-3"
                  >
                    <Bone className="h-2 w-12 rounded" />
                    <Bone className="h-4 w-20 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Base Stats */}
            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <Bone className="mb-4 h-5 w-32" />
              <div className="flex flex-col gap-4">
                {(
                  [
                    "w-1/3",
                    "w-1/2",
                    "w-2/5",
                    "w-3/5",
                    "w-2/5",
                    "w-1/2",
                  ] as const
                ).map((w, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[64px_40px_1fr_44px] items-center gap-3"
                  >
                    <Bone className="h-3 w-12 rounded" />
                    <Bone className="h-4 w-8 rounded" />
                    <Bone className={`h-2 rounded-full ${w}`} />
                    <Bone className="h-3 w-8 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Evolution Chain */}
            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <Bone className="mb-4 h-5 w-40" />
              <div className="flex items-center gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {i > 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <Bone className="h-2 w-10 rounded" />
                        <Bone className="h-3 w-4 rounded" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <Bone className="h-16 w-16 rounded-2xl" />
                      <Bone className="h-2 w-10 rounded" />
                      <Bone className="h-3 w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Defenses */}
            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <Bone className="mb-4 h-5 w-36" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, col) => (
                  <div key={col} className="rounded-xl bg-white/5 p-4">
                    <Bone className="mb-3 h-2 w-16 rounded" />
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 3 + col }).map((_, j) => (
                        <Bone key={j} className="h-5 w-14 rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
