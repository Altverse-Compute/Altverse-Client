import { Card } from "./basic/Card.tsx";
import { useEffect, useRef, useState } from "preact/hooks";
import { ApiRequests } from "../api/requests.ts";
import { http } from "../proto/generated/js/index";

interface Props {
  username?: string;
}

export const ProfileCard = (props: Props) => {
  const [profile, setProfile] = useState<http.IProfile>();
  const [error, setError] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const fetch = async () => {
      if (props.username) {
        const value = await ApiRequests.profile(props.username);
        console.log(value);
        if (
          value.status !== http.ResponseStatus.NotFound &&
          value.profile != null
        ) {
          setProfile(value!.profile!);
          console.log(value.profile);
          setError(false);
        } else {
          setError(true);
        }
      }
    };
    clearTimeout(timeout.current);
    timeout.current = setTimeout(fetch, 200);
  }, [props.username]);

  const role = () => {
    switch (profile?.role) {
      case http.AccountRole.DEV:
        return <div className={"badge badge-primary text-xl"}>Dev</div>;
      case http.AccountRole.MOD:
        return <div className={"badge badge-secondary text-xl"}>Mod</div>;
    }
  };

  if (error)
    return (
      <div className={"w-full alert alert-error alert-soft text-xl"}>
        Profile is not found
      </div>
    );

  return (
    <div className={"w-full"}>
      <Card size={"sm"} loading={profile == undefined}>
        <div className={"flex flex-col"}>
          <h1 className={"text-2xl flex flex-row  items-center gap-2"}>
            {profile?.username}
            {role()}
          </h1>
          <div className={"text-lg"}>
            {profile != undefined && <>Victory Points: {profile?.vp}</>}
          </div>
          {profile != undefined &&
            Object.keys(profile?.highest!).length !== 0 && (
              <details>
                <summary className={"text-xl"}>Highest</summary>
              </details>
            )}
        </div>
      </Card>
    </div>
  );
};
