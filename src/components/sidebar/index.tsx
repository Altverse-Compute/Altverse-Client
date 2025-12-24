import { SideBarButton } from "./button.tsx";
import { useLocation } from "wouter";

export const Sidebar = () => {
  let [location, setLocation] = useLocation();

  return (
    <div className={"w-[250px] h-min-screen bg-(--elements-bg) pr-14"}>
      <h1 className={"text-[36px] h-[100px] text-center pt-1 w-[280px]"}>
        <b className={"pl-1 text-(--logo-accent) "}>Alt</b>verse
      </h1>
      <div>
        <ul className={"w-[250px] pl-2 text-2xl text-left"}>
          <li>Home</li>
          <SideBarButton
            onClick={() => setLocation("/")}
            className={"mt-1"}
            selected={location == "/"}
          >
            Play
          </SideBarButton>
          <SideBarButton
            onClick={() => setLocation("/profile")}
            selected={location == "/profile"}
          >
            Profiles
          </SideBarButton>
        </ul>
      </div>
      <p className={"fixed bottom-1 left-2 text-2xl "}>Version: 0.0.0</p>
    </div>
  );
};
