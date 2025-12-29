export const Base = () => {
    return <div className={"md:w-[700px] w-full text-2xl flex flex-col gap-2 pt-4"}>
        <h1 className={"text-center text-3xl"}>Welcome to Altverse! Have fun!</h1>
        <p className={"alert alert-warning alert-soft text-2xl"}>Due to the state of the game, registration of new accounts is done using a token.</p>
        <h1 className={"divider text-3xl"}>A little about the game</h1>
        <p>The game is inspired by another io game, the original game is called <a href="https://evades,io" target={"_blank"} className={"link link-info"}>evades.io</a>. </p>
        <p>It is currently being slowly developed by <a href="https://ether.cd" target={"_blank"} className={"link link-info"}>EtherCD</a>. </p>
        <h1 className={"divider text-3xl"}>Game idea</h1>
        <p>The original idea of ​​the game was to make an alternative version of the original, with new content and features.</p>
    </div>
}