import { AccountRole } from "../../types";
import { useEffect, useState } from "preact/hooks";
import { ApiRequests } from "../../api/requests";
import type { Profile } from "../../api/types.ts";

interface Props {
  username: string;
  className?: string;
}

export const ProfileCard = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();

  // const styleForBg = () => {
  //   if (profile) {
  //     if (profile.role === AccountRole.Dev)
  //       return "text-[#fff] bg-linear-to-br from-[#008080] via-[#66b2b2] to-[#004C4C]";
  //     if (profile.role === AccountRole.MapMaker)
  //       return "text-[#fff] bg-linear-to-br from-[#005B96] via-[#6497b1] to-[#011f4b]";
  //   }
  // };

  useEffect(() => {
    const fetch = async () => {
      setProfile((await ApiRequests.profile(props.username + "")).data.profile);
    };
    fetch();
  }, []);

  const role = () => {
    if (profile) {
      if (profile.role === AccountRole.Dev) return "Dev";
      if (profile.role === AccountRole.MapMaker) return "Map Maker";
    }
  };

  if (profile)
    return (
      <>
        <div
          className={
            "p-1 flex flex-col w-[250px] p-1 bg-[#9FB8D222] rounded-2xl gap-[5px] text-left outline-1 outline-[#9FB8D2] " +
            props.className +
            " "
          }
        >
          <div className={"flex text-xl flex-col "}>
            <h1 className={"font-semibold text-2xl"}>
              Username: {profile.username}
            </h1>
            {profile.role !== AccountRole.None && <p>Role: {role()}</p>}
            <p className={"text-xl"}>VP: {profile.vp}</p>
            {/*<details className={"text-center"}>*/}
            {/*  <summary>Highest Records</summary>*/}
            {/*  */}
            {/*  */}
            {/*</details>*/}
          </div>
        </div>
      </>
    );

  return <h1 className={"text-4xl"}>Not found.</h1>;
};
