import {Sidebar} from "../components/Sidebar.tsx";
import {Route} from "wouter";
import {GamePlay} from "./game/Play.tsx";
import {GameProfile} from "./game/Profile.tsx";

export const GamePage = () => {

    return <>
        <div className={"w-full flex flex-1"}>
                <Sidebar></Sidebar>
                    <div className={"w-full flex flex-row justify-center"}>
                        <Route path={"/home"} component={GamePlay}/>
                        <Route path={"/home/profile"} component={GameProfile}/>
                    </div>
        </div>
          </>
}