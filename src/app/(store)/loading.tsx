export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 lg:px-8">
      <div className="mx-auto mb-10 h-8 w-48 rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] rounded bg-cream" />
            <div className="h-3 w-1/3 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
            <div className="h-4 w-1/4 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
