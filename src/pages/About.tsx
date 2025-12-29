import {Card} from "../components/basic/Card.tsx";
import {Link} from "wouter";
import {useAuthStore} from "../stores/auth.ts";

export const About = () => {
  const auth = useAuthStore();

  return <>
      <div className={"flex gap-2 flex-col md:flex-row"}>
        <Card>
          <h1 className={"text-xl"}>Game status</h1>
          <ul className="steps steps-vertical text-lg">
            <li className="step step-primary">Prototype</li>
            <li className="step step-primary">Client</li>
            <li className="step step-neutral">Public test</li>
            <li className="step step-neutral">Content</li>
            <li className="step step-neutral">Release</li>
          </ul>
        </Card>
        <div
            className={"card text-center md:text-left bg-base-300 md:w-[800px] w-full flex flex-col md:flex-row items-center md:gap-20 gap-2 justify-center"}>
          <div className={"flex flex-col gap-2"}>
            <h1 className={"text-4xl"}>Altverse</h1>
          <p className={"text-2xl"}>A fan game based on evades.io.</p>
          <div className={"alert alert-warning alert-soft text-xl"}>
            Game still in deep developing
          </div>
          {auth.valid &&
              <Link href={"/home"} className={"btn btn-lg btn-accent"}>Play now!</Link>
          }
          {!auth.valid &&
              <Link href={"/login"} className={"btn btn-lg btn-accent"}>Sign in to play</Link>
          }
        </div>
        <img src="/favicon.svg" alt="Favicon" width={190}/>
      </div>
      </div>
      <div className="divider text-2xl">Key features</div>
      <h1 className={"text-center text-2xl"}></h1>
      <div className={"flex gap-2 flex-col md:flex-row"}>
        <Card>
          <h1 className={"text-xl flex gap-1"}><i class="bi bi-hdd-stack-fill"></i>Scalability</h1>
          <p className={"text-lg"}>By connecting the main server to the game servers using gRPC, the game can easily scale to any number of
            servers.</p>
        </Card>
        <Card>
          <h1 className={"text-xl flex gap-1"}><i class="bi bi-git"></i>OpenSource</h1>
          <p className={"text-lg"}>The game code is available on GitHub and is open source, licensed under the GPL-3 license.</p>
        </Card>
        <Card>
          <h1 className={"text-xl flex gap-1"}><i class="bi bi-lightning-charge-fill"></i>Performance</h1>
          <p className={"text-lg"}>The game server consists of NodeJS and Rust game logic, using optimized and efficient libraries, ensuring
            high performance.</p>
        </Card>
      </div>
  </>
};
