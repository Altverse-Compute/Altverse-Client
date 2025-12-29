import type {ComponentChildren} from "preact";

interface Props {
    children: ComponentChildren
    outline?: "info" | "warning" | "success" | "error"
    size?: "sm" | "md" | "lg" | "xl"
    loading?: boolean
}

export const Card = (props: Props) => {

    return <div className={"card card-"+ ( props.size ? props.size : "lg" )+ " p-1 card-border bg-base-300 border-base-300 "+(props.loading ? "skeleton": "")}>
        <div className={"card-body"}>
        {props.children}
        </div>
    </div>
}

