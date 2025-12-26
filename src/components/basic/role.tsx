import { AccountRole } from "../../types";

interface Props {
  role: AccountRole;
}

export const Role = (props: Props) => {
  const styleForBg = () => {
    if (props) {
      if (props.role === AccountRole.Dev)
        return "text-[#fff] bg-linear-to-br from-[#008080] via-[#66b2b2] to-[#004C4C]";
      if (props.role === AccountRole.Mod)
        return "text-[#fff] bg-linear-to-br from-[#a7adba] via-[#343d46] to-[#c0c5ce]";
    }
  };

  const role = () => {
    console.log(props)
    if (props) {
      if (props.role === AccountRole.Dev) return "Dev";
      if (props.role === AccountRole.Mod) return "Moderator";
    }
  };

  if (props.role !== AccountRole.None)
  return (
    <div className={"p-0.5 rounded-2xl outline-1 " + styleForBg()}>
      {role()}
    </div>
  );
};
