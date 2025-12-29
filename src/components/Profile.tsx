import {Card} from "./basic/Card.tsx";
import {useEffect, useState} from "preact/hooks";
import {ApiRequests} from "../api/requests.ts";
import {useAuthStore} from "../stores/auth.ts";
import type {Profile} from "../api/types.ts";
import {AccountRole} from "../types.ts";

interface Props {
    username?: string;
}

export const ProfileCard = (props: Props) => {
    const [profile, setProfile] = useState<Profile>()

    useEffect(() => {
        const fetch = async () => {
            if (props.username) setProfile((await ApiRequests.profile(props.username)).profile)
            else setProfile(useAuthStore.getState().profile!)
        }
        fetch()
    }, [props.username])

    const role = () => {
        switch (profile?.role) {
            case AccountRole.Dev:
                return <div className={"badge badge-primary text-xl"}>Dev</div>
            case AccountRole.Mod:
                return <div className={"badge badge-secondary text-xl"}>Mod</div>
        }
    }

    return <div className={'w-full'}><Card size={"sm"} loading={profile == undefined}>
        <div className={"flex flex-col"}>
        <h1 className={"text-2xl flex flex-row  items-center gap-2"}>
            {profile?.username}
            {role()}
        </h1>
        <div className={"text-lg"}>
            Victory Points: {profile?.vp}
        </div>
        </div>
    </Card>
    </div>
}