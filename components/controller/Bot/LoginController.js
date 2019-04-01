import React from 'react';
export default class LoginController extends React.Component {
    async login ( setUsername, setPassword ) {
        var url, body, seed;
        seed = Math.floor( Math.random() * ( +99999 - +0 ) ) + +0;
        url = "https://www.999doge.com/api/web.aspx";
        body = "a=Login"
            + "&Key=" + '56f1816842b340a6bc07246801552702'
            + "&Username=" + setUsername
            + "&Password=" + setPassword;
        try {
            const response = await fetch( url, {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: body
            } );
            const responseJson = await response.json();
            return responseJson;
        } catch ( error ) {
            return 1;
        }
    }
}
