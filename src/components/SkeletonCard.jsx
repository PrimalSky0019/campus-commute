export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-20 bg-gray-100 rounded-xl mb-4"></div>
      <div className="flex justify-between">
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )
}