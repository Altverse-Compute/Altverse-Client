import {Link} from "wouter";
import {useAuthStore} from "../stores/auth.ts";
import {ThemeSelector} from "./basic/ThemeSelector.tsx";

export const Header = () => {
    const auth = useAuthStore()

    return <div className={"navbar w-full bg-base-300 p-2 flex flex-row justify-between"}>
        <div className={"flex items-center gap-2 justify-center"}>
            <img src="/favicon.svg" alt="Favicon" width="40"/>
            <h1 className={"text-xl"}>Altverse</h1>
            <ThemeSelector />
        </div>
        <ul className="menu menu-horizontal bg-base-200 text-xl">
            <li><Link href={"/"}>About</Link></li>
            {auth.valid && <li><Link href={"/home"}>Home</Link></li>}

        </ul>
        <div className={"flex text-xl"}>
            {!auth.valid &&  <Link href={"/login"} className={"btn btn-primary btn-lg"}>Login</Link>}
            {auth.valid &&  <button onClick={() => auth.logout()} className={"btn btn-secondary btn-lg"}>Logout</button>}
        </div>
    </div>
}