import { Sidebar } from "../components/Sidebar.tsx";
import { Route } from "wouter";
import { GamePlay } from "./dashboard/Play.tsx";
import { GameProfile } from "./dashboard/Profile.tsx";
import { Base } from "./dashboard/Base.tsx";
import { DevLaunch } from "./dashboard/Launch.tsx";
import { GameChangelog } from "./dashboard/Changelog.tsx";
import { AdminPanel } from "./dashboard/AdminPanel.tsx";
import { Notifications } from "../components/Notifications.tsx";

export const Dashboard = () => {
  return (
    <>
      <div className={"w-full flex flex-1 gap-2 flex-col md:flex-row"}>
        <Sidebar></Sidebar>
        <Notifications></Notifications>
        <div
          className={
            "mockup-window border border-base-300 bg-base-300 pr-4 w-full flex flex-row justify-center "
          }
        >
          <Route path={"/dashboard"} component={Base} />
          <Route path={"/dashboard/play"} component={GamePlay} />
          <Route path={"/dashboard/profile"} component={GameProfile} />
          <Route path={"/dashboard/changelog"} component={GameChangelog} />
          <Route path={"/dashboard/launch"} component={DevLaunch} />
          <Route path={"/dashboard/admin"} component={AdminPanel} />
        </div>
      </div>
    </>
  );
};
