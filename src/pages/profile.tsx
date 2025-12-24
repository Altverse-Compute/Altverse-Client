import { Sidebar } from "../components/sidebar";
import { ProfileCard } from "../components/profile";
import { useParams } from "wouter";
import { Header } from "../components/header.tsx";
import { TextField } from "../components/basic/text.tsx";
import { useState } from "preact/hooks";

export const ProfilePage = () => {
  const params = useParams();
  const [username, setUsername] = useState("");

  return (
    <div className={"flex flex-row h-screen w-screen gap-1 text-2xl"}>
      <Sidebar />
      <Header />
      <div className={"w-full flex flex-col justify-center items-center gap-1"}>
        <h1>Search profile by username</h1>
        <TextField
          placeholder={"Username"}
          onInput={setUsername}
          value={username}
        />
        <ProfileCard
          username={params["username"] != null ? params["username"] : username}
        />
      </div>
    </div>
  );
};
