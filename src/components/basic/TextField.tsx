interface Props {
    placeholder?: string
    type: "text" | "password"
    onInput: (value: string) => void
    error?: boolean
}

export const TextField = (props: Props) => {
return <input type={props.type} className={"input input-lg " + (props.error ? "input-error" : "")} placeholder={props.placeholder} onInput={event => {
    props.onInput((event.target! as HTMLInputElement).value + "")
}}/>
}