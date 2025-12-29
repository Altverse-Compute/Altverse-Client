import {ServerList} from "../../components/ServerList"
import {ProfileCard} from "../../components/Profile.tsx";
import {Breadcrumbls} from "../../components/basic/Breadcrumbls.tsx";
import {useState} from "preact/hooks";
import {Game} from "../../components/game";

export const GamePlay = () => {
    const [url, setUrl] = useState("");

    if (url.length != 0) {
        return <Game ip={url} />
    }

    return <div className={"md:w-[700px] w-full text-2xl flex flex-col gap-2"}>
        <Breadcrumbls array={["General", "Play"]}/>
        <h1>Welcome to Altverse. Have fun!</h1>
        <h1>Here your profile:</h1>
        <ProfileCard />
        <ServerList onSelect={(url) => {setUrl(url)}}></ServerList>
    </div>
}