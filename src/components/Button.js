import React from 'react'


const Button = ({text, id, className, style}) => {
  return (<button data-id={id} className={className} style={style}>{text}</button>)
}

export default Button
