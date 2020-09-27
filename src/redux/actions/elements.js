import {
    ADD_ELEMENT_TO_NODE, DELETE_ELEMENT, DELETE_ELEMENT_PROPERTY, EDIT_ELEMENT_CLASSNAME, EDIT_ELEMENT_PROPERTY,
    SET_ACTIVE_ELEMENT,
} from "@action_types//elements"

export const setActiveElement = (id) => {
    return {
        type: SET_ACTIVE_ELEMENT,
        id
    }
}

export const addElementToActiveNode = (elementType) => {
    return {
        type: ADD_ELEMENT_TO_NODE,
        elementType,
    }
}

export const editElementProperty = (property) => {
    return {
        type: EDIT_ELEMENT_PROPERTY,
        property
    }
}
export const deleteElementProperty = (property) => {
    return {
        type: DELETE_ELEMENT_PROPERTY,
        property
    }
}

export const editClassName = (className) => {
    return{
        type:EDIT_ELEMENT_CLASSNAME,
        className
    }
}

export const deleteActiveNode = () => {
    return {
        type: DELETE_ELEMENT
    }
}

