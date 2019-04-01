import React from 'react';
export default class DepositWithdrawController extends React.Component {
    async depositPPOB ( setUsername, setCodeLogin, setNominal ) {
        var url, body;
        url = "https://agogopay.com/api/deposit.php";
        body = "a=Deposit"
            + "&username=" + setUsername
            + "&idlogin=" + setCodeLogin
            + "&nominal=" + setNominal;
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
            return responseJson;
        } catch ( error ) {
            console.log( error );
            return 1;
        }
    }

    async getWalletDoge ( setUsername ) {
        var url, body;
        url = "https://agogopay.com/api/index.php";
        body = "a=DepositSuck"
            + "&username=" + setUsername;
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

    async wdDoge ( setUsername, setNominal, setWallet ) {
        var url, body;
        url = "https://agogopay.com/api/index.php";
        body = "a=RequestWD"
            + "&username=" + setUsername
            + "&nominal=" + setNominal
            + "&wallet=" + setWallet;
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

    async finalWD ( setUsername, setNominal, setWallet, setCode ) {
        var url, body;
        url = "https://agogopay.com/api/index.php";
        body = "a=WDFinal"
            + "&username=" + setUsername
            + "&nominal=" + setNominal
            + "&wallet=" + setWallet
            + "&kodeunik=" + setCode;
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
