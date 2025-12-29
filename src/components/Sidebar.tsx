import {Link} from "wouter";

export const Sidebar = () => {
    return <div className={"flex p-2 bg-base-300 flex-col w-[350px]"}>
        <ul className="menu rounded-box w-full text-xl">
            <li>
                <h2 className="menu-title flex gap-2 text-xl"><i className="bi bi-person"></i> Game</h2>
                <ul>
                    <li><Link href={"/home"}>Play</Link></li>
                    <li><Link href={"/home/profile"}>Profiles</Link></li>
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