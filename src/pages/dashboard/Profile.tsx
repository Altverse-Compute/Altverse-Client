import { ProfileCard } from "../../components/Profile.tsx";
import { useEffect, useState } from "preact/hooks";
import { TextField } from "../../components/basic/TextField.tsx";
import { Breadcrumbls } from "../../components/basic/Breadcrumbls.tsx";
import { useAuthStore } from "../../stores/auth.ts";

export const GameProfile = () => {
  const [username, setUsername] = useState(
    useAuthStore().profile?.username + "",
  );

  const auth = useAuthStore();

  useEffect(() => {
    if (auth.profile && auth.profile.username) {
      setUsername(auth.profile.username);
    }
  }, [auth.profile?.username]);

  return (
    <div className={"md:w-[700px] w-full text-2xl flex flex-col gap-2 pt-4"}>
      <Breadcrumbls array={["General", "Profile"]} />
      <h1 className={"text-center"}>Find profile by username</h1>
      <div className={"flex justify-center"}>
        <TextField
          type={"text"}
          onInput={(val) => setUsername(val)}
        ></TextField>
      </div>
      <ProfileCard username={username} />
    </div>
  );
};
