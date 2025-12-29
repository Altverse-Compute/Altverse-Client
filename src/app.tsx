import {Route, Router} from "wouter";
import {Login} from "./pages/Login.tsx";
import {Register} from "./pages/Register.tsx";
import {About} from "./pages/About.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import {Footer} from "./components/Footer.tsx";
import {Header} from "./components/Header.tsx";

export const App = () => {
  return (
      <>
          <div className={"flex w-full flex-col min-h-screen items-center"}>
              <div className={"md:w-[1000px] w-full flex flex-col gap-2 items-center min-h-screen"}>
                  <Header/>
                <Router>
                <Route path={"/login"} component={Login} />
                <Route path={"/register"} component={Register} />
                  <Route path={"/"} component={About} />
                  <Route path={"/dashboard/:?page"} component={Dashboard} />
                </Router>
                  <Footer></Footer>
              </div>
          </div>
      </>
  );
};
