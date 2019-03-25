import React from 'react';
export default class OvoController extends React.Component {
    async Request ( setUsername, setCode, setPhoneNumber, setNominal, setType ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/isiovo.php";
        body = "a=ReqPulsa" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&nohp=" + setPhoneNumber +
            "&nominal=" + setNominal +
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

    async Pay ( setUsername, setCode, setPhoneNumber, setPayCode, setNominal, setFirstBalance, setPrice, setRemainingBalance ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/isiovo.php";
        body = "a=PayPulsa" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&nohp=" + setPhoneNumber +
            "&kode=" + setPayCode +
            "&nominal=" + setNominal +
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
