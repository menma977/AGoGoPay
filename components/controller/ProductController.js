import React from 'react';
export default class ProductController extends React.Component {
    async Request ( setUsername, setCode ) {
        var url, body, errorResponse;
        url = "https://agogopay.com/api/produk.php";
        body = "a=Produk" + "&username=" + setUsername + "&idlogin=" + setCode;
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
                const data = responseJson.reduce( ( responseJson, { Operator, TypeProduk, Kode, Nama } ) => {
                    responseJson[ Operator ] = responseJson[ Operator ] || [];
                    responseJson[ Operator ].push( { type: TypeProduk, code: Kode, name: Nama } );
                    return responseJson;
                }, {} );
                return data;
            } else {
                return errorResponse;
            }
        } catch ( error ) {
            console.log( error );
            return errorResponse;
        }
    }
}
