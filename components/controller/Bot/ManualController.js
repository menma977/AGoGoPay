import React from 'react';
export default class ManualController extends React.Component {
    async bot ( setSession, setHigh, setPayIn ) {
        var url, body, errorResponse, seed;
        seed = Math.floor( Math.random() * ( +99999 - +0 ) ) + +0;
        url = "https://www.999doge.com/api/web.aspx";
        body = "a=PlaceBet"
            + "&s=" + setSession
            + "&Low=" + '0'
            + "&High=" + setHigh
            + "&PayIn=" + setPayIn
            + "&ProtocolVersion=" + '2'
            + "&ClientSeed=" + seed
            + "&Currency=" + 'doge';
        try {
            const response = await fetch( url, {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                } ),
                body: body
            } );
            const responseJson = await response.json();
            if ( !responseJson.error ) {
                let getPayIn = -setPayIn;
                let getPayOut = responseJson.PayOut;
                let getProfit = getPayOut + getPayIn;
                let shareData = {
                    Status: 200,
                    payIn: getPayIn,
                    payOut: getPayOut,
                    profit: getProfit
                };
                return shareData;
            } else {
                return { Status: 505, error: responseJson.error };
            }
        } catch ( error ) {
            return { Status: 404, error: 'Internet tidak setabil mohon ulangi lagi' };
        }
    }
}
