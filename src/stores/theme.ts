import {create} from "zustand";
import {persist} from "zustand/middleware";

export type Theme = "default" | "dark-plus"
export const ThemesNames: Theme[] = ["default", "dark-plus"]

interface State {
    value: Theme;
    setTheme: (value: Theme) => void;
}

export const useThemeStore = create(
    persist<State>(
        (set) => ({
            value: "default",
            setTheme: (value: Theme) => set({
                value
            })
        }),
        {
            name: "theme",
        },
    ),
)