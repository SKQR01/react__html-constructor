import React, {Component} from "react"
import {cloneDeep, find, findLast, xor} from "lodash"
import {
    SET_ACTIVE_ELEMENT,
    ADD_ELEMENT_TO_NODE, EDIT_ELEMENT_PROPERTY, DELETE_ELEMENT, DELETE_ELEMENT_PROPERTY, EDIT_ELEMENT_CLASSNAME
} from "@action_types//elements";
import {generateIdElement} from "@src/utils"


const elementIdGenerator = generateIdElement()

const generateElementInitalState = (elementType, parentId) => {
    const id = elementIdGenerator.next().value
    switch (elementType) {
        case "BLOCK":
            return (
                {
                    id: id,
                    type: elementType,
                    className: `${id}`,
                    style: {
                        background: "orange",
                        padding: "1rem"
                    },
                    parent: parentId,
                    childrens: [],
                }
            )
        case "INPUT":
        case "BUTTON":
            return (
                {
                    id: id,
                    type: elementType,
                    className: `${id}`,
                    text: "",
                    style: {},
                    parent: parentId
                }
            )
    }

}

const initialState = {
    activeElement: {
        id: 1,
        type: "BLOCK",
        className:`1`,
        style: {},
        childrens: [],
        root: true
    },
    root: [
        {
            id: elementIdGenerator.next().value,
            type: "BLOCK",
            className:`1`,
            style: {},
            childrens: [],
            root: true
        }
    ]
}

const addNode = (elementType, activeElement, root) => {
    const newChild = generateElementInitalState(elementType, activeElement.id)
    const parentNode = find(root, el => el.id === activeElement.id)

    root.push(newChild)
    parentNode.childrens.push(newChild.id)

    return root
}

//mutable
const editNode = (activeElement, property, root) => {
    const editableNode = find(root, el => el.id === activeElement.id)
    editableNode.style = {
        ...editableNode.style,
        ...property
    }
    return root
}

const findNodeTreeIds = (resultArray, root, nodeChildrens) => {
    if (typeof (nodeChildrens) !== "undefined" && nodeChildrens.length !== 0) {
        let childsOfChildsArray = []
        let childsArray = [...nodeChildrens]
        for (const id of childsArray) {
            const element = find(root, el => el.id === id)
            if (typeof (element.childrens) !== "undefined" && element.length !== 0) {
                childsOfChildsArray = childsOfChildsArray.concat(find(root, el => el.id === id).childrens)
            }
        }
        resultArray.push(...childsOfChildsArray)
        return findNodeTreeIds(resultArray, root, childsOfChildsArray)
    }
    return resultArray
}

const deleteNode = (state) => {

    if (state.activeElement.root) {
        return state
    }

    let parentElement = find(state.root, el => el.id === state.activeElement.parent)
    const newActive = findLast(state.root, el => el.id < state.activeElement.id)

    let arrayToDelete = [state.activeElement.id]
    let newRoot = state.root
    if (typeof (state.activeElement.childrens) !== "undefined") {
        arrayToDelete = findNodeTreeIds([...arrayToDelete, ...state.activeElement.childrens], state.root, state.activeElement.childrens)
        newRoot = state.root.filter(node => {
            if (!arrayToDelete.includes(node.id)) {
                return node
            }
        })
    }
    parentElement.childrens = parentElement.childrens.filter(id => {
        if (!arrayToDelete.includes(id)) {
            return id
        }
    })
    return {
        activeElement: newActive,
        root: newRoot
    }
}

//mutable
const deleteNodeProperty = (propertyToDelete, activeElement, root) => {
    const editableNode = find(root, el => el.id === activeElement.id)
    delete editableNode.style[propertyToDelete]
    delete activeElement.style[propertyToDelete]
    return {activeElement, root}
}

//mutable
const editElementClassName = (className, activeElement, root) => {
    const editableNode = find(root, el => el.id === activeElement.id)
    editableNode.className = className
    return root
}

// элементный редъюсер
const elementReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACTIVE_ELEMENT:
            return {
                ...state,
                activeElement: {...find(state.root, el => el.id === action.id)},
            }
        case ADD_ELEMENT_TO_NODE:
            return {
                ...state,
                root: addNode(action.elementType, {...state.activeElement}, cloneDeep(state.root))
            }
        case DELETE_ELEMENT:
            return {...deleteNode(cloneDeep(state))}
        case DELETE_ELEMENT_PROPERTY:
            return {
                ...deleteNodeProperty(action.property, cloneDeep(state.activeElement), cloneDeep(state.root))
            }
        case EDIT_ELEMENT_PROPERTY:
            return {
                activeElement: {
                    ...state.activeElement,
                    style: {
                        ...state.activeElement.style,
                        ...action.property
                    }
                },
                root: editNode({...state.activeElement}, action.property, cloneDeep(state.root))
            }
        case EDIT_ELEMENT_CLASSNAME:
            return {
                ...state,
                root: editElementClassName(action.className, {...state.activeElement}, cloneDeep(state.root))
            }
        default:
            return state
    }
}

export default elementReducer
