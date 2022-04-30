import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { apiCall } from "../utils";
import "../css/login.css";

function LoginPage() {
    const cookies = new Cookies();
    
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    
    function handelUserNameChange(e) {
        setuserName(e.target.value)
    }

    function handelPasswordChange(e) {
        setPassword(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (userName !== "" && password !== "") {
            const apiResp = await apiCall("http://localhost:4000/api/users?userName=" + userName + "&password=" + password);
            if (apiResp.statusCode === 200) {
                const userId = apiResp?.data[0]?.id;
                if (userId) {
                    cookies.set('userId', userId);
                    document.location.href = "/home";
                } else {
                    setMsg(apiResp.msg)
                }
            } else {
                setMsg(apiResp.msg)
            }

        } else {
            setMsg("Please enter Your Username and Password")
        }
    }

    return (
        <div id="background">
            <div id="wrapper">
                <form id="form" onSubmit={handleFormSubmit}>
                    <div>
                        <input type="text" placeholder="User Name" id="userName" value={userName} onChange={handelUserNameChange} />
                    </div>

                    <div>
                        <input type="password" placeholder="Password" id="password" value={password} onChange={handelPasswordChange} />
                    </div>

                    <div>
                        <button id="login">Login</button>
                    </div>

                    <div id="msg" className="red" > {msg} </div>
                    <hr />

                    <a href="/createAcc">
                        <div id="createAcc">Create New Account</div>
                    </a>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;