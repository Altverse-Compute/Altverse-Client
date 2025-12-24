import { useAuthStore } from "../stores/auth.ts";
import { Button } from "./basic/button.tsx";
import logoutIcon from "resources/icons/logout.svg";
import githubIcon from "resources/icons/github.svg";
import { AccountRole } from "../types";
import { Role } from "./basic/role.tsx";

export const Header = () => {
  const auth = useAuthStore();
  return (
    <div
      className={
        "w-full fixed top-1.5 left-0 text-left flex justify-between  items-center"
      }
    >
      <div className={"ml-15 flex flex-row gap-0.5"}>
        <h1 className={"p-0.5 outline-1 rounded-2xl"}>
          Howdy {auth.profile?.username}!
        </h1>
        <p className={"p-0.5 outline-1 rounded-2xl"}>VP: {auth.profile?.vp}</p>
        {auth.profile?.role != AccountRole.None && (
          <Role role={auth.profile ? auth.profile.role : AccountRole.None} />
        )}
      </div>
      <div className={"pr-1 flex flex-row items-start gap-1"}>
        <Button
          onClick={() => {
            location.href = "https://github.com/EtherCD/Altverse";
          }}
          className={"h-[52px] w-[52px]"}
        >
          <img
            className={"items-center pl-[2px]"}
            width={30}
            height={30}
            src={githubIcon}
            alt={"github"}
          ></img>
        </Button>
        <Button
          onClick={() => {
            auth.logout();
          }}
          className={"h-[52px] w-[52px]"}
        >
          <img
            className={"items-center pl-[2px]"}
            width={30}
            height={30}
            src={logoutIcon}
            alt={"logout"}
          ></img>
        </Button>
      </div>
    </div>
  );
};
