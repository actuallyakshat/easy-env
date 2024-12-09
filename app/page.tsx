import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <section className="-mt-16">
      <div className="mx-auto max-w-screen-xl px-4 py-32 flex h-screen items-center">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Never Lose Your
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              Environment Variables Again.
            </strong>
          </h1>

          <p className="mt-4 font-medium sm:text-xl/relaxed">
            Easy Env allows you to securely store your environment variables at
            one place so that you can access them anywhere, anytime.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-primary/80 focus:outline-none focus:ring sm:w-auto"
              href="/dashboard"
            >
              {userId ? "View Dashboard" : "Login"}
            </Link>

            <Link
              target={"_blank"}
              className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-primary/80 focus:outline-none focus:ring  sm:w-auto"
              href="https://github.com/actuallyakshat/easy-env"
            >
              Github
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
