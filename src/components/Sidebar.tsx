import {Link} from "wouter";
import {useAuthStore} from "../stores/auth.ts";

export const Sidebar = () => {
    const auth = useAuthStore()

    return <div className={"flex p-2 bg-base-300 flex-col md:w-[350px]"}>
        <ul className="menu rounded-box w-full text-xl">
            {auth.valid && <>
                <li>
                    <h2 className="menu-title flex gap-2 text-xl"><i className="bi bi-controller"></i> Game</h2>
                    <ul>
                        <li><Link href={"/dashboard/play"}>Play</Link></li>
                        <li><Link href={"/dashboard/profile"}>Profiles</Link></li>
                    </ul>
                </li>
                {/*<li>*/}
                {/*    <h2 className="menu-title flex gap-2 text-xl"><i className="bi bi-person"></i>Account</h2>*/}
                {/*    <ul>*/}
                {/*        <li><Link href={"/dashboard"}>Settings</Link></li>*/}
                {/*    </ul>*/}
                {/*</li>*/}
            </>}
            <li>
                <h2 className="menu-title flex gap-2 text-xl"><i className="bi bi-person"></i>Development</h2>
                <ul>
                    <li><Link href={"/dashboard/launch"}>Launch</Link></li>
                </ul>
            </li>

        </ul>
    </div>
}

export const DocsSidebar = () => {
    return <div className={"flex p-2 bg-base-300 flex-col w-[350px]"}>
        <ul className="menu rounded-box w-full text-xl">
            <li>
                <h2 className="menu-title flex gap-2 text-xl"><i className="bi bi-person"></i>Deploy</h2>
                <ul>
                    <li><Link href={"/home"}>Dev mode</Link></li>
                    <li><Link href={"/home/profile"}>Nginx configuration</Link></li>
                </ul>
            </li>
        </ul>
    </div>
}