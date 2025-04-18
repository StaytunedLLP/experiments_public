import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import def from "@repo/fd_domain2/fe_one/sy_one/bk_validators/code.ts";
import def2 from "@repo/fd_domain1/fe_one/sy_one/bk_services/code.ts";
import chalk from "chalk";
import def3 from "@repo/fd_fresh_domain/fe_random/code.ts";

export default function Home() {
  const count = useSignal(3);
  def
  def2
  def3

  // Log for fd_fresh_domain (main folder) - chalk v5.2.0
  console.log(chalk.green("======= Fresh Domain Main (chalk v5.2.0) ======="));
  console.log(chalk.green("Message from fd_fresh_domain:", chalk.bold(chalk.bgYellow(" skynet "))));

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />
      </div>
    </div>
  );
}
