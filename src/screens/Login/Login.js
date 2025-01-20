import React, {useContext, useEffect, useRef, useState} from 'react';

import cls from './Login.module.scss'
import {useNavigate} from "react-router-dom";
import createUser from "../../shared/lib/createUser";
import MyContext from "../../Context/Context"; // Импортируем axios
let BACKEND_URL_BODY = "localhost:5020"


function Login({onClose}) {
    const navigate = useNavigate();
    const [res, setRes] = useState()
    const [user, setUserId] = useState(window?.Telegram?.WebApp?.initDataUnsafe?.user)
    const [inputValue, setInputValue] = useState('eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1MjM1NTg4OSwiaWQiOiIwMTk0NTRiNC00YWFmLTc0YjItYTFmYy1iNjJhYjRkZWMyMzYiLCJpaWQiOjE3OTMyMDM4LCJvaWQiOjE0MDg3NzEsInMiOjgsInNpZCI6IjEwYjYyMDM4LWFmY2YtNDIwMS04YzQwLTQ2ZTI0ZjQwZWZlOSIsInQiOmZhbHNlLCJ1aWQiOjE3OTMyMDM4fQ.TfN_-bxc_xxkRh-0pikWGM5RK15Zu1DUO1iaZVIsPkDfxxTFBzGcZHyX_uI9mYECLsIRveTSPOPqxdICObX1pQ');
    let url = `http://${BACKEND_URL_BODY}/api/users`;
    const { APIValue, setAPIValue } = useContext(MyContext);
    const data = {
        tgId: user?.id || 111,
        userAPI: inputValue
    };

    // const handleUser = async () => {
    //     await createUser(url, data)
    //         .then((data) => {
    //             setRes(data)
    //         })
    //         .catch((err) => {setRes(err)})
    //     if (res === 201 || res === 409) {
    //         setAPIValue(inputValue)
    //         navigate('/catalog')
    //     }
    // }


    const handleUser = async () => {
        // await createUser(url, data)
        //     .then((data) => {
        //         setRes(data)
        //     })
        //     .catch((err) => {setRes(err)})
        if (inputValue !== '') {
            setAPIValue(inputValue)
            navigate('/catalog')
        }
    }

    const handleChange = (event) => {
        setInputValue(event?.target?.value);
    };


    return (
        <div className={cls.Login}>
            <h1>Введите ваш API ключ</h1>
            <input className={cls.Input} type="text" placeholder="API ключ" value={inputValue} onChange={handleChange}/>
            <button className={cls.Button} onClick={handleUser}>Войти</button>
            <div>{res}</div>
            <div>{user?.id}</div>
        </div>
    );
}

export default Login;