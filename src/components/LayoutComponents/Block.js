
const Block = ({children, id, style, onClick, className}) => {

    return(
        <div data-id={id} style={style} className={className} onClick={onClick}>{children}</div>
    )
}

export default Block