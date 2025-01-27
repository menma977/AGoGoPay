import React from 'react';
export default class LoginController extends React.Component {
    async DataLogin ( setUsername, setPassword ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/login.php";
        body = "a=ReqLogin" + "&username=" + setUsername + "&password=" + setPassword;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch( url, {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: body
            } );
            const responseJson = await response.json();
            if ( responseJson ) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch ( error ) {
            return errorResponse;
        }
    }

    async FinalLogin ( username, code ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/login.php";
        body = "a=FinalLogin" + "&username=" + username + "&kode=" + code;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch( url, {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: body
            } );
            const responseJson = await response.json();
            if ( responseJson ) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch ( error ) {
            return errorResponse;
        }
    }
}
