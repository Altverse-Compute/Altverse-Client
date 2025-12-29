import {create} from "zustand";
import {persist} from "zustand/middleware";

interface State {
    value: "default" | "dark" | "black";
    setTheme: (value: "default" | "dark" | "black") => void;
}

export const useThemeStore = create(
    persist<State>(
        (set) => ({
            value: "default",
            setTheme: (value: "default" | "dark" | "black") => set({
                value
            })
        }),
        {
            name: "theme",
        },
    ),
)