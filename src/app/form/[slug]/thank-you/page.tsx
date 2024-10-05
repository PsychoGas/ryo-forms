export default function ThankYouPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-stone-100 text-stone-800">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-6 text-matcha">
          Thank You for Your Submission
        </h1>
        <p className="text-xl sm:text-2xl text-stone-600 mb-10 font-light max-w-3xl">
          Your form has been successfully submitted. We appreciate your time and
          input.
        </p>
      </main>
    </div>
  );
}
