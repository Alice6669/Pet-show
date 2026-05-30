import React from 'react'
import { useRouteError } from "react-router-dom";
import "./erroPage.css"

const ErroPage = () => {

    const error = useRouteError();
    console.error(error);
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Temos um problema.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

export default ErroPage