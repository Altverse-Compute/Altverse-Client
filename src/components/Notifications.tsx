import { useNotificationsStore } from "../stores/notification";

export const Notifications = () => {
  const { notifications } = useNotificationsStore();

  return (
    <div className={"absolute right-2 top-2 grid grid-col-1 gap-2 z-10"}>
      {notifications.map((value) => (
        <>
          <div className={"p-5 rounded-2xl bg-" + value.type}>
            <h1 className={"text-2xl text-white"}>{value.title}</h1>
            <p className={"text-xl text-white"}>{value.message}</p>
          </div>
        </>
      ))}
    </div>
  );
};
