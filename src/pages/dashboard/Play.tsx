import {ServerList} from "../../components/ServerList"
import {Breadcrumbls} from "../../components/basic/Breadcrumbls.tsx";
import {useState} from "preact/hooks";
import {Game} from "../../components/game";

export const GamePlay = () => {
    const [url, setUrl] = useState("");

    if (url.length != 0) {
        return <Game ip={url} />
    }

    return <div className={"md:w-[700px] w-full text-2xl flex flex-col gap-2 pt-4"}>
        <Breadcrumbls array={["General", "Play"]}/>
        <h1 className={"text-center"}>Welcome to Altverse. Have fun!</h1>
        <div className="divider ">Server list</div>
        <ServerList onSelect={(url) => {
            setUrl(url)
        }}></ServerList>
    </div>
}