import React from 'react';
export default class PhoneCodeController extends React.Component {
    Telkomsel ( setPhone ) {
        let Array = [ '0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }

    Indosat ( setPhone ) {
        let Array = [ '0814', '0815', '0816', '0855', '0856', '0857', '0858' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }

    XL ( setPhone ) {
        let Array = [ '0817', '0818', '0819', '0859', '0877', '0878' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }

    Axis ( setPhone ) {
        let Array = [ '0831', '0832', '0838' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }

    Smart ( setPhone ) {
        let Array = [ '0881', '0882', '0887', '0888' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }

    Three ( setPhone ) {
        let Array = [ '0895', '0896', '0897', '0898', '0899' ];
        let found = Array.find( function ( element ) {
            return element == setPhone;
        } );
        return found;
    }
}
