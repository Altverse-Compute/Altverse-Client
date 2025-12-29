interface Props {
    lines: string[];
}

export const Code = (props: Props) => {
    return <div className={"mockup-code text-lg"}>
        {props.lines.map((line, i) => (
            <pre data-prefix={i+1}><code>{line}</code></pre>
        ))}
    </div>
}

