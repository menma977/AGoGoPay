import React from 'react';
export default class PaymentController extends React.Component {
    async Request ( setUsername, setCode, setPhoneNumber, setIdClient, setFirstBalance, setType ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/payment.php";
        body = "a=ReqPayment" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&idpel=" + setIdClient +
            "&nohp=" + setPhoneNumber +
            "&saldoawal=" + setFirstBalance.replace( '.', '' ) +
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

    async Pay ( setUsername, setCode, setType, setClientID, setClientName, setPrice, setAdmin, setTotalPrice, setPhoneNumber, setRemainingBalance, setRef, setPeriodic ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/payment.php";
        body = "a=BayarPayment" +
            "&username=" + setUsername +
            "&idlogin=" + setCode +
            "&type=" + setType +
            "&idpel=" + setClientID +
            "&npelanggan=" + setClientName +
            "&jmltagih=" + setPrice +
            "&admin=" + setAdmin +
            "&totaltagih=" + setTotalPrice +
            "&hppembeli=" + setPhoneNumber +
            "&sisasaldo=" + setRemainingBalance +
            "&ref=" + setRef +
            "&periodetagih=" + setPeriodic;
        errorResponse = { Status: 1, Pesan: 'Internet tidak setabil mohon ulangi lagi' };
        try {
            const response = await fetch( url, {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: body
            } );
            console.log( body );
            console.log( response );
            const responseJson = await response.json();
            console.log( responseJson );
            if ( responseJson ) {
                return responseJson;
            } else {
                return errorResponse;
            }
        } catch ( error ) {
            console.log( error );
            return errorResponse;
        }
    }
}
