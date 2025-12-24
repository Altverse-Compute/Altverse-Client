import { useEffect, useState } from "preact/hooks";
import { TextField } from "../components/basic/text.tsx";
import { Button } from "../components/basic/button";
import { useAuthStore } from "../stores/auth";
import { Link, useLocation } from "wouter";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [error, setError] = useState<string>("");

  const auth = useAuthStore();

  const validate = async (event: Event) => {
    event.preventDefault();
    if (username.length == 0) {
      setError("Field with username will be filled");
      return;
    }
    if (username.length >= 16) {
      setError("Username is too long");
      return;
    }
    if (password.length <= 3) {
      setError("Password is too short");
      return;
    }
    if (token.length < 32) {
      setError("Register token too short");
      return;
    }

    const error = await auth.register({
      username,
      password,
      registerToken: token,
    });

    setError(error);
  };

  const [_, navigate] = useLocation();

  useEffect(() => {
    if (auth.valid) navigate("/");
  }, [auth.valid]);

  return (
    <main
      className={
        "min-h-screen w-full flex justify-center items-center text-center"
      }
    >
      <form class={"flex flex-col gap-1 items-center"}>
        <h1 className={"text-[40px] h-[100px] text-center pt-1 w-[280px]"}>
          <b className={"pl-1 text-(--logo-accent) "}>Alt</b>Verse
        </h1>
        <TextField
          placeholder={"Username"}
          onInput={(value) => {
            setUsername(value);
          }}
        />
        <TextField
          placeholder={"Password"}
          type={"password"}
          onInput={(value) => {
            setPassword(value);
          }}
        />
        <TextField
          placeholder={"Register token"}
          onInput={(value) => {
            setToken(value);
          }}
        />
        <Button onClick={validate} className={"w-[280px]"}>
          Register
        </Button>
        <Link href={"/login"} className={"text-2xl"}>
          Login to account
        </Link>
        {error.length !== 0 && (
          <div
            className={
              "w-[280px] p-1 text-left block font-bold bg-(--co) text-(--bg) text-2xl"
            }
          >
            <span>{error}</span>
          </div>
        )}
      </form>
    </main>
  );
};
