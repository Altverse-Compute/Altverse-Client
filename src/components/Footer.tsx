export const Footer = () => {
    return <footer className={"footer sm:footer-horizontal bg-neutral text-neutral-content p-2 w-[1000px] flex justify-between"}>
        <aside className={"flex flex-row items-center"}>
            <h1 className={"text-xl"}>Developed by @EtherCD</h1>
        </aside>
        <aside>
            <a href="https://github.com/Altverse-Compute">
                <i className="bi bi-github text-2xl"></i>
            </a>
        </aside>
    </footer>
}