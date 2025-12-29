import {useThemeStore} from "../../stores/theme.ts";

export const ThemeSelector = () => {
    const theme= useThemeStore()

    return <div className="dropdown">
        <div tabIndex="0" role="button" className="btn m-1 btn-lg">
            Theme
        </div>
        <ul tabIndex="-1" className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2">
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start text-lg"
                    aria-label="Default"
                    value="default"
                    checked={theme.value === 'default'}
                    onChange={(e) => (e.target as HTMLInputElement).checked && theme.setTheme("default")}/>
            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start text-lg"
                    aria-label="Dark"
                    value="dim"
                    checked={theme.value === 'dark'}
                    onChange={(e) => (e.target as HTMLInputElement).checked && theme.setTheme("dark")}/>
            </li>
            <li>
                <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start text-lg"
                    aria-label="Black"
                    value="black"
                    checked={theme.value === 'black'}
                    onChange={(e) => (e.target as HTMLInputElement).checked && theme.setTheme("black")}/>
            </li>
        </ul>
    </div>
}