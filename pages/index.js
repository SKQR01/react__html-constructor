import Container from "react-bootstrap/Container"
import {useDispatch, useSelector} from "react-redux"
import React, {useCallback, useEffect} from "react"

import {setActiveElement} from "@actions/elements"
import Sidebar from "@components/Sidebar"
import {renderChildNode, findNodeContent} from "@src/utils"
import Block from "@layout/Block"
import Button from "@components/Button"


function MainCanvas() {
    const root = useSelector(state => state.elementReducer.root)
    const rootEl = useSelector(state => state.elementReducer.root[0])
    const activeID = useSelector(state => state.elementReducer.activeElement)
    const dispatch = useDispatch()

    const setElement = useCallback((id) => {
        dispatch(setActiveElement(id))
    }, [activeID])

    const clickHandler = (event) => {
        setElement(+event.target.dataset.id)
    }

    return (
        <>
            <Sidebar/>
            <div style={rootEl.style} id={'main-canvas'} data-id={rootEl.id} onClick={clickHandler}>
                {
                    findNodeContent(rootEl, root).map(childNode => {
                            return renderChildNode(childNode, root)
                        }
                    )
                }
            </div>
        </>
    )
}

export default MainCanvas


