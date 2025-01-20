
import axios from 'axios';
const createUser = async (url, data) => {
    let response
    try {
        response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log("User created successfully");
        return response.status

    } catch (error) {
        console.log("Error creating user:", error?.response?.status);
        return error?.response?.status;
    }
};

export default createUser;
