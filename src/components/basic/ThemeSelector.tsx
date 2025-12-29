import {ThemesNames, useThemeStore} from "../../stores/theme.ts";

export const ThemeSelector = () => {
    const theme= useThemeStore()

    return <div className="dropdown dropdown-">
        <div tabIndex="0" role="button" className="btn m-1 btn-lg">
            Theme
        </div>
        <ul tabIndex="-1" className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2">
            {ThemesNames.map((v, i) => <li>
                <input
                    key={i}
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start text-lg"
                    aria-label={v}
                    value={v}
                    checked={theme.value === v}
                    onChange={(e) => (e.target as HTMLInputElement).checked && theme.setTheme(v)}/>
            </li>)}

        </ul>
    </div>
}