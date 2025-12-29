import {Code} from "../../components/basic/Code.tsx";
import {Breadcrumbls} from "../../components/basic/Breadcrumbls.tsx";

export const DevLaunch = () => {
    return <div className={"md:w-[700px] w-full text-xl flex flex-col gap-2 pt-4"}>
        <Breadcrumbls array={["Development", "Launch"]}/>
        <h1 className={"divider text-3xl"}>Game Launch Guide</h1>
        <p>The application consists of several components (client, service, server). Each component requires assembly. Here's a list of all the components and how to assemble them.</p>
        <h2 className={"divider text-2xl"}>Required packages</h2>
        <p className={"alert alert-info text-xl"}><i class="bi bi-info-circle-fill"></i>To improve performance, bun is used as a runtime on the service and client.</p>
        <p className={"alert alert-info text-xl"}><i class="bi bi-info-circle-fill"></i>When cloning a repository, add the --recursive flag.</p>
        <p>To compile and run some game components you need to install:</p>
        <ul className={"flex gap-2 flex-col"}>
            <li className={"flex items-center  gap-2"}>
                <div class="status status-info animate-ping"></div>
                <a href="https://bun.com/" className={"link link-info"} target={"_blank"}>Bun</a>
            </li>
            <li className={"flex items-center  gap-2"}>
                <div class="status status-info animate-ping"></div>
                <a href="https://nodejs.org/uk" className={"link link-info"} target={"_blank"}>NodeJS</a>
            </li>
            <li className={"flex items-center  gap-2"}>
                <div class="status status-info animate-ping"></div>
                <a href="https://rust-lang.org/" className={"link link-info"} target={"_blank"}>Rust Lang</a>
            </li>
            <li className={"flex items-center  gap-2"}>
                <div class="status status-info animate-ping"></div>
                <a href="https://protobuf.dev/installation/" className={"link link-info"} target={"_blank"}>Protobuf</a>
            </li>
        </ul>
        <h2 className={"divider text-2xl"}>The client</h2>
        <p>Edit src/config.ts</p>
        <Code lines={["export const config = {\n",
        "  api: \"http://localhost:7001\"\n",
        "};"]}></Code>
        <p>And</p>
        <Code lines={["bun run dev", "bun run build"]}/>
        <h2 className={"divider text-2xl"}>The service</h2>
        <p>The service represents the "business" logic, since it is responsible for working with the database and linking servers together.</p>
        <p>Copy the .env file. You'll see a lot of fields here.</p>
        <Code lines={[
            "#  Service running mode",
            "MODE=dev",
            "#  Main http port",
            "PORT=7001",
            "#  Communication port with game servers",
            "GRPC_PORT=7030",
            "#  A token that users can use to register",
            "REGISTER_TOKEN=Token",
            "#  Used for CORS and protection",
            "FRONTEND_URL=\"http://localhost:7010\"",
            "#  MongoDB URLe",
            "DATABASE_URL=\"mongodb://127.0.0.1/altverse\""
        ]} />
        <p>The token must be at least 32 characters (or 16 hex bytes)</p>
        <h3 className={"divider text-xl"}>Database setup</h3>
        <p>To create the required fields, use the command in the service directory</p>
        <Code lines={["bun run prisma:gen # Generate client for database", "npx prisma db push # Deploy schema to database"]}></Code>
        <p>Connect to the database via MongoDB Compass and add a new element to the Server collection. Below is an example of insertion.</p>
        <Code lines={[
            "{",
            "\t\"name\": \"Dev Server\",",
            "\t\"icon\": \"X\",",
            "\t\"token\": \"your random token\",",
            "\t\"domain\": \"https://localhost:7002\",",
            "}"
        ]}/>
        <p>The token must be at least 64 characters long (or 32 bytes in hex). Generate the token using openssl.</p>
        <Code lines={["openssl rand -hex 32"]}></Code>
        <p>Then just run the service:</p>
        <Code lines={["bun run dev"]}></Code>
        <h2 className={"divider text-2xl"}>The Server</h2>
        <p> Copy the .env.example file and enter all the required data.</p>
        <Code lines={["MODE=dev",
            "PORT=7002",
            "GRPC_HOST=localhost:7030",
            "GRPC_TOKEN=\"Token with 64 length\"",
            "FRONTEND_URL=localhost:7010",
            "TICK_RATE=60",
            "STORAGE_PATH=storage",
            "WORLDS_PATH=worlds"]}></Code>
        <p className={"alert alert-warning text-xl"}>To build you compute module will need rust lang and protobuf</p>
        <p>The next step is to</p>
        <Code lines={["cd src/compute", "npm run install", "npm run build"]}></Code>
        <p>Let's return to the root directory and start the server!</p>
        <Code lines={["npm run dev"]}></Code>

        <p className={"text-2xl text-center mt-10 mb-10"}>Congratulations, you have launched the game!</p>
    </div>

}