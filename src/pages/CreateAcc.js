import React, { useState } from 'react';
import { apiCall, validateUsername } from "../utils";
import Loader from "../components/Loader";

import "../css/login.css";

document.title = "Bhemu Notes | Create Your Account";

function CreateAcc() {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);

    function handleNewUsername(e) {
        setuserName(e.target.value)
    }

    function handleNewPassword(e) {
        setPassword(e.target.value)
    }

    function handleConfirmPassword(e) {
        setConfPassword(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if(userName !== "" && password !== "" && confPassword !== "") {
            if (!validateUsername(userName)) {
                setMsg("Please Enter a Valid Username (Only Alphanumeric Allowed)");
                return;
            }

            if(password === confPassword) {
                setIsApiLoading(true);
                
                const apiResp = await apiCall("users", false , "post", { username: userName , password: password});
                if (apiResp.statusCode === 200) {
                    setIsApiLoading(false);
                    setMsg(apiResp.msg)
                    document.location.href = "/";
                } else {
                    setIsApiLoading(false);
                    setMsg(apiResp.msg)
                }
            } else {
                setMsg("Passwords didn't match. Try again.")
            }
        } else {
            setMsg("Please enter all data.")
        }
    }

    return (
        <div id="background">
            <div id="wrapper">
                <form id="form" onSubmit={ handleFormSubmit }>
                    <div>
                        <input type="text" placeholder="User Name (6 digit)" id="newUserName" pattern="().{6,}" value={ userName } onChange={handleNewUsername} />
                    </div>

                    <div>
                        <input type="Password" placeholder="Password (8 digit)" id="newPassword" pattern="().{8,}" value={ password } onChange={handleNewPassword} />
                    </div>

                    <div>
                        <input type="Password" placeholder="Confirm Password (8 digit)" id="confirmPass" pattern="().{8,}" value={ confPassword } onChange={handleConfirmPassword} />
                    </div>

                    <hr />

                    <div id="updateMsg" className="red"> {msg} </div>

                    <div>
                        <button id="signup" className={ isApiLoading? "isSignup": "" } >Sign Up</button>
                    </div>

                    <Loader isLoading={isApiLoading} />
                    
                    <div id='alreadyAcc' style={isApiLoading? null: { margin: "25px 0px 5px 0px" }} >
                        <a href = "/" >Already have an Account</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateAcc;