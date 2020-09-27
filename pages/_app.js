import React from 'react'
import {wrapper} from "@redux/store"

import '../styles/globals.css'
import '../styles/components/sidebar.scss'
import "bootstrap/dist/css/bootstrap.min.css"


const MyApp = ({Component, pageProps}) => (
    <Component {...pageProps} />
)

export default wrapper.withRedux(MyApp)


