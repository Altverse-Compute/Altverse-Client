import {Card} from "../components/basic/Card.tsx";
import {TextField} from "../components/basic/TextField.tsx";
import {useEffect, useRef, useState} from "preact/hooks";
import {Link} from "wouter";
import {useAuthStore} from "../stores/auth.ts";
import {navigate} from "wouter/use-browser-location";

export const Login = () => {
  const username = useRef<string>("");
  const password = useRef<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<string>("")

  const validate = () => {
    if (username.current.length == 0) {
      setUsernameError(true);
      setError("Username must be filled!")
      return
    } else {
      setUsernameError(false)
    }

    if (username.current.length > 16) {
      setUsernameError(true);
      setError("Username must be less than 16 characters")
      return
    } else {
      setUsernameError(false)
    }

    if (password.current.length < 4) {
      setPasswordError(true)
      setError("The password must be longer than 4 characters.")
      return
    }

    setPasswordError(false)
    setUsernameError(false)
    setError("")
  }

  const auth = useAuthStore()

  useEffect(() => {
    if (auth.valid) navigate("/dashboard")
  }, [auth.valid]);

  return <>

    <div className={"w-full h-full flex-1 border border-base-300 bg-base-300  flex flex-col justify-center items-center bg-base-200"}>
      <Card>
          <h1 className={"text-2xl"}>Sign in</h1>
          <TextField type="text" placeholder={"Enter username"} error={usernameError} onInput={value => {
            username.current = value
            validate()
          }} />
          <TextField type="password" placeholder={"Enter password"} error={passwordError} onInput={value => {
            password.current = value
            validate()
          }} />
          <button class={"btn btn-accent btn-lg"} onClick={() => {
            auth.login({
              username: username.current, password: password.current
            })
            validate()
          }}>Join</button>
        <Link href={"/register"} className={"link link-primary text-xl"}>Don't have account?</Link>


        <div>
          {error.length > 0 &&
              <div className={"text-xl alert alert-error alert-soft"}>{error}</div>
          }
        </div>
      </Card>
    </div>
  </>

};
