import React from "react"
import Block from "@layout/Block"
import Button from "@components/Button"
import Input from "@components/Input"
import {find} from "lodash"

export const findNodeContent = (parentNode, root) => {
    return parentNode.childrens.map(childNodeId => {
        return find(root, el => el.id === childNodeId)
    })
}

export function renderChildNode(childNode, root) {
    switch (childNode.type) {
        case "BLOCK":
            return <Block key={childNode.id} style={childNode.style} id={childNode.id} className={childNode.className}>
                {
                    findNodeContent(childNode, root).map(child => {
                            return renderChildNode(child, root)
                    })
                }
            </Block>
        case "BUTTON":
            return <Button key={childNode.id} style={childNode.style} id={childNode.id} className={childNode.className} text={"Кнопка"}/>
        case "INPUT":
            return <Input key={childNode.id} style={childNode.style} id={childNode.id} className={childNode.className}/>
    }
}


export function* generateIdElement(id = 1) {

    while (true) {
        yield id
        ++id
    }
}