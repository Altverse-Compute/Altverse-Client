import type { Assets } from "./types";

export const GlobalAssets: Assets = {
    textures: {
        leaves: "worlds/leaves3.png",
        leavesCorners: "worlds/corners.png",
        road: "worlds/road.png",
        leaf: "entity/leaf.png",
        leaf2: "entity/leaf2.png",
    },
    zones: {
        teleport_world: {
            fillColor: "#6AD0DE",
        },
        teleport: {
            fillColor: "#FFF46C",
        },
        victory: {
            fillColor: "#FFF46C",
        },
        active: {
            fillColor: "#fff",
        },
        safe: {
            fillColor: "#C1C1C1",
        },
        wall: {
            fillColor: "#222",
        },
        exit: {
            fillColor: "#FFFABA",
        },
    },
    entities: [
        ["#787878"], /// normal
        ["#000"], // wall
        ["#000"], // immune
        ["#A05353"], // sniper
        ["#A05353"], // bullet
        ["#565656"], // changer
        ["#00EB00"], // corrosive
        ["#679fff"], // drop
        ["#fff"], // leaf
        ["#A0780A"], // homing
        ["#aaa"], //  vortex
        ["#f00"], // slower
        ["#00f"], // draining
        ["#ffbfce"], // disable
        ["#563232"], // tree
        ["#ffc18c"], // bee
        ["#D09C0D"], // homing_sniper
        ["#D09C0D"], // homing_bullet
        ["#D53E07"], // flame
        ["#D53E07"], // trail,
        ["#F86630"], // flame_sniper
        ["#d0e2ed"], // cloud
    ],
};