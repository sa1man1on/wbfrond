import React, { useState } from 'react';
import MyContext from './Context';

const MyProvider = ({ children }) => {
    const [APIValue, setAPIValue] = useState('eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1MjM1NTg4OSwiaWQiOiIwMTk0NTRiNC00YWFmLTc0YjItYTFmYy1iNjJhYjRkZWMyMzYiLCJpaWQiOjE3OTMyMDM4LCJvaWQiOjE0MDg3NzEsInMiOjgsInNpZCI6IjEwYjYyMDM4LWFmY2YtNDIwMS04YzQwLTQ2ZTI0ZjQwZWZlOSIsInQiOmZhbHNlLCJ1aWQiOjE3OTMyMDM4fQ.TfN_-bxc_xxkRh-0pikWGM5RK15Zu1DUO1iaZVIsPkDfxxTFBzGcZHyX_uI9mYECLsIRveTSPOPqxdICObX1pQ');

    return (
        <MyContext.Provider value={{ APIValue, setAPIValue }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyProvider;
