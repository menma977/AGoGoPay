import React from 'react';
export default class LoginController extends React.Component {
    async DataLogin(setUsername, setPassword) {
        var url, body, errorResponse;
        url = "https://www.klabee.com/api/index.php";
        body = "a=Login" +
            "&username=" + setUsername +
            "&password=" + setPassword;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: body
            });
            const responseJson = await response.json();
            if (responseJson) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch (error) {
            return errorResponse;
        }
    }
}
