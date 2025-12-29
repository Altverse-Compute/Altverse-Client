import {Sidebar} from "../components/Sidebar.tsx";
import {Route} from "wouter";
import {GamePlay} from "./dashboard/Play.tsx";
import {GameProfile} from "./dashboard/Profile.tsx";
import {Base} from "./dashboard/Base.tsx";
import {DevLaunch} from "./dashboard/Launch.tsx";

export const Dashboard = () => {
    return <>
        <div className={"w-full flex flex-1 gap-2 flex-col md:flex-row"}>
                <Sidebar></Sidebar>
                    <div className={"mockup-window border border-base-300 bg-base-300 pr-4 w-full flex flex-row justify-center"}>
                        <Route path={"/dashboard"} component={Base}/>
                        <Route path={"/dashboard/play"} component={GamePlay}/>
                        <Route path={"/dashboard/profile"} component={GameProfile}/>
                        <Route path={"/dashboard/launch"} component={DevLaunch}/>
                    </div>
        </div>
          </>
}