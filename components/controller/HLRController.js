import React from 'react';
export default class HLRController extends React.Component {
    async Request ( setUsername, setCode ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/hlr.php";
        body = "a=Hlr" + "&username=" + setUsername + "&idlogin=" + setCode;
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
