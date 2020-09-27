import Container from "react-bootstrap/Container"
import {useSelector, useDispatch} from "react-redux"
import {useCallback, useEffect, useState} from "react"
import {FaPlusCircle, FaTrashAlt} from 'react-icons/fa'

import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import {
    addElementToActiveNode,
    deleteActiveNode,
    deleteElementProperty,
    editClassName,
    editElementProperty
} from "@actions/elements"
import {generateIdElement} from "@src/utils"

const spreadStyle = (element) => {
    let nodeStylePropertiesArray = []
    for (let key in element.style) {
        nodeStylePropertiesArray.push({key: key, value: element.style[key]})
    }
    return nodeStylePropertiesArray
}

const idGenerator = generateIdElement()


function Sidebar() {
    const activeElement = useSelector(state => state.elementReducer.activeElement)

    const [sidebarVisability, setSidebarVisability] = useState(true)
    const [propertyName, setPropertyName] = useState()
    const [className, setClassName] = useState('')
    const [htmlCode, setHtmlCode] = useState()

    const dispatch = useDispatch()

    useEffect(() => {
        setClassName(activeElement.className)
    }, [activeElement.id])



    const editElementClassName = useCallback((className) => {
        dispatch(editClassName(className))
    }, [className])

    const editElement = useCallback((properties) => {
            dispatch(editElementProperty(properties))
        },
        [activeElement.style])

    const deleteProperty = useCallback((property) => {
            dispatch(deleteElementProperty(property))
        },
        [activeElement.style])

    const addElement = useCallback((elementType) => {
        dispatch(addElementToActiveNode(elementType))
    }, [activeElement])

    const removeElement = useCallback(() => {
        dispatch(deleteActiveNode())
    }, [activeElement])


    return (
        <>
            <button onClick={() => setSidebarVisability(true)}
                    style={{transform: sidebarVisability ? 'scale(0)' : 'scale(1)', transition: '0.3s'}}>Развернуть
            </button>
            <Container className={"sidebar"}
                       style={{transform: sidebarVisability ? 'scale(1)' : 'scale(0)', transition: '0.3s'}}>
                <button onClick={() => setSidebarVisability(false)}>Свернуть</button>

                <div className="sidebar-header">
                    <h2>ID:{activeElement.id}</h2>
                    <h3>Class name:</h3>
                    <input
                        value={className}
                        onChange={event => setClassName(event.target.value)}
                        onBlur={() => {
                            editElementClassName(className)
                        }
                        }/>
                    <button onClick={removeElement}>Удалить элемент</button>
                </div>
                <Tabs defaultActiveKey="profile" id="sidebar-tab">
                    <Tab eventKey="elements" title="Элементы">
                        <Tabs defaultActiveKey="profile" id="sidebar-elements-tab">
                            <Tab eventKey="marking" title="Разметка">
                                <div className={"sidebar-element-actions"}>
                                    <button onClick={() => {
                                        addElement("BLOCK")
                                    }}
                                            className={"sidebar-element-actions__button"}>Добавить блок
                                    </button>
                                </div>
                            </Tab>
                            <Tab eventKey="managment" title="Управление">
                                <div className={"sidebar-element-actions"}>
                                    <button onClick={() => addElement("INPUT")}
                                            className={"sidebar-element-actions__button"}>Добавить поле ввода
                                    </button>
                                    <button onClick={() => addElement("BUTTON")}
                                            className={"sidebar-element-actions__button"}>Добавить кнопку
                                    </button>
                                </div>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab eventKey="profile" title="Свойства">
                        <div className="sidebar-properties">
                            {
                                spreadStyle(activeElement).map(property => {
                                        return (
                                            <div className={"sidebar-property"} key={idGenerator.next().value}>
                                                <h3 className={"sidebar-property__key"}>{property.key}</h3>
                                                <div className="sidebar-property-block">
                                                    <input className={"sidebar-property-block__value"}
                                                           defaultValue={property.value}
                                                           onBlur={(event) => {
                                                               editElement({[property.key]: `${event.target.value}`})
                                                           }
                                                           }/>
                                                    <FaTrashAlt className={"sidebar-property-block__deleteButton"}
                                                                onClick={() => deleteProperty(property.key)}/>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                        <div className="sidebar-properties-add">
                            <input value={propertyName} className="sidebar-properties-add__input"
                                   onChange={event => {
                                       setPropertyName(event.target.value)
                                   }}/>
                            <button className="sidebar-properties-add__button"
                                    onClick={() => {
                                        editElement({[propertyName]: ""})
                                        setPropertyName("")
                                    }}>
                                <FaPlusCircle/>
                            </button>
                        </div>
                    </Tab>
                    <Tab eventKey="code" title="Код">
                        <div>{htmlCode}</div>
                        <button onClick={() => setHtmlCode(document.getElementById("main-canvas").innerHTML)}>Сгенерировать html и css</button>
                    </Tab>
                </Tabs>

            </Container>
        </>
    )

}

export default Sidebar

