import { config } from "../../config.ts";

interface Props {
  onSelect: (id: number) => void;
}

export const ServerList = (props: Props) => {
  return (
    <>
      {config.servers.map((server, index) => (
        <div
          className={
            "pt-1 pb-1 pr-1 bg-[#9FB8D222] flex flex-row outline-2 outline-[#9FB8D2] rounded-[10px] min-w-15  hover:opacity-75 transition-opacity"
          }
          onClick={() => props.onSelect(index)}
        >
          <b
            className={
              "w-[60px] h-full text-center justify-center flex items-center  "
            }
          >
            {server.flag}
          </b>
          <div className={"flex flex-col text-left"} key={index}>
            <h1>{server.name}</h1>
            <p className={"text-[18px] opacity-75"}>Current online: 0/100</p>
          </div>
        </div>
      ))}
    </>
  );
};
