import { useEffect, useState } from "preact/hooks";
import {type ServerElement } from "../../api/types.ts";
import { ApiRequests } from "../../api/requests.ts";

interface Props {
  onSelect: (ip: string) => void;
}

export const ServerList = (props: Props) => {
  const [servers, setServers] = useState<Array<ServerElement>>([])

  useEffect(() => {
    const fetch = async () => {
      setServers((await ApiRequests.servers()).servers!)
    }
    fetch()
  }, [])

  return (
    <>
      {servers.map((server, index) => (
        <div
          className={
            "pt-1 pb-1 pr-1 bg-[#9FB8D222] flex flex-row outline-2 outline-[#9FB8D2] rounded-[10px] min-w-15  hover:opacity-75 transition-opacity"
          }
          onClick={() => props.onSelect(server.domain)}
        >
          <b
            className={
              "w-[60px] h-full text-center justify-center flex items-center  "
            }
          >
            {server.icon}
          </b>
          <div className={"flex flex-col text-left"} key={index}>
            <h1>{server.name}</h1>
            <p className={"text-[18px] opacity-75"}>Current online: {server.online}</p>
          </div>
        </div>
      ))}
    </>
  );
};
