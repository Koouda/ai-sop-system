export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        AI SOP Generator
      </h1>

      <textarea
        className="border p-4 w-full mt-6"
        rows={8}
        placeholder="Describe your process..."
      />

      <button className="bg-black text-white px-6 py-3 mt-4">
        Generate SOP
      </button>
    </main>
  )
}