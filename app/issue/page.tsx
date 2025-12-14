// app/issues/page.tsx

export default function IssuePage() {
  return (
    <section className="px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Encountered an issue?
        </h1>

        <p className="mt-4 text-zinc-600 leading-relaxed">
          I'm not surprised (lol). If something broke or looks off, please
          email me at{" "}
          <a
            href="mailto:jovia@ucsb.edu"
            className="font-medium text-blue-600 hover:underline"
          >
            jovia@ucsb.edu
          </a>
          .
        </p>
      </div>
    </section>
  );
}
