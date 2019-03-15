import React from 'react';
export default class PLNController extends React.Component {
    async Request ( setUsername, setCode, setPhoneNumber, setToken, setType ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/isitoken.php";
        body = "a=ReqToken" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&nohp=" + setPhoneNumber +
            "&idpel=" + setToken +
            "&type=" + setType;
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

    async Pay ( setUsername, setCode, setPhoneNumber, setPayCode, setToken, setFirstBalance, setPrice, setRemainingBalance ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/isitoken.php";
        body = "a=PayToken" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&nohp=" + setPhoneNumber +
            "&kode=" + setPayCode +
            "&idpel=" + setToken +
            "&saldoawal=" + setFirstBalance +
            "&harga=" + setPrice +
            "&sisasaldo=" + setRemainingBalance;
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
