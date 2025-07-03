export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Upzento CRM</h1>
      <p className="text-xl mb-4">Your all-in-one customer relationship management solution</p>
      <div className="mt-8">
        <a href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </a>
      </div>
    </main>
  );
}
