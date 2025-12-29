interface Props {
    array: string[]
}

export const Breadcrumbls = (props: Props) => {
    return <div className="breadcrumbs text-xl">
        <ul>
            {props.array.map((v,i) => <li key={i}>{v}</li>)}
        </ul>
    </div>
}