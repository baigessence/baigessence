export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 lg:px-8">
      <div className="mb-8 h-4 w-48 rounded bg-gray-100" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="mx-auto aspect-[3/4] w-full max-w-md rounded bg-cream lg:max-w-lg" />
        <div className="space-y-4">
          <div className="h-3 w-24 rounded bg-gray-100" />
          <div className="h-10 w-3/4 rounded bg-gray-100" />
          <div className="h-4 w-1/2 rounded bg-gray-100" />
          <div className="mt-6 h-8 w-32 rounded bg-gray-100" />
          <div className="mt-8 space-y-2">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-4/6 rounded bg-gray-100" />
          </div>
          <div className="mt-8 h-12 w-full rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
