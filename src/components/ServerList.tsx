import {useEffect, useState} from "preact/hooks";
import type {ServersResonse} from "../api/types.ts";
import {ApiRequests} from "../api/requests.ts";
import {Card} from "./basic/Card.tsx";

interface Props {
    onSelect: (url: string) => void
}

export const ServerList = (props: Props) => {
    const [servers, setServers] = useState<ServersResonse |undefined >();

    useEffect(() => {
        const fetchServers = async () => {
            const servers = await ApiRequests.servers()
            setServers(servers)
        }
        fetchServers()
    }, []);

    return <div className={"flex flex-col w-full text-2xl gap-1"}>
        <h1 className={""}>Server list:</h1>
        {servers == undefined &&
            <div className={"skeleton w-full h-[66px]"}></div>
        }
        {servers != undefined && servers!.servers!.map((server) => (
            <div className={"w-full"}>
                <Card size={"sm"}>
                <div className={"flex items-center justify-between"}>
                    <div className={"flex justify-end items-center"}>
                    <h1 className={"text-3xl w-10"}>{server.icon}</h1>
                    <div>
                        <h1 className={"text-2xl"}>{server.name}</h1>
                        <p className={"text-xl"}>Current online {server.online}</p>
                    </div>
                    </div>
                    <button className={"btn btn-lg btn-primary" } onClick={() => {props.onSelect(server.domain)}}>Join</button>
                </div>
            </Card>
            </div>
        ))}
        {servers != undefined && servers!.servers!.length == 0 && (
            // <Card  size={"sm"}>
            //     <h1 className={"text-xl"}>None of the servers are running</h1>
            // </Card>
            <div className={"alert alert-error alert-soft text-xl"}>
                None of the servers are running
            </div>
        )}
    </div>
}