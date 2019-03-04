import React from 'react';
import { Toast } from 'native-base';

export default class Config extends React.Component {
    newAlert(setNum, setMassage, setDuration, setPosition) {
        if (setNum == 1) {
            Toast.show({
                text: setMassage,
                buttonText: "Tutup",
                position: setPosition,
                type: "success",
                duration: setDuration
            })
        } else if (setNum == 2) {
            Toast.show({
                text: setMassage,
                buttonText: "Tutup",
                position: setPosition,
                type: "warning",
                duration: setDuration
            })
        } else if (setNum == 3) {
            Toast.show({
                text: setMassage,
                buttonText: "Tutup",
                position: setPosition,
                type: "danger",
                duration: setDuration
            })
        } else {
            Toast.show({
                text: setMassage,
                buttonText: "Tutup",
                position: setPosition,
                duration: setDuration
            })
        }
    }

    async sendImage(data) {
        const date = new Date();
        const nameFile = data.uri.split('/');
        const formData = new FormData();
        formData.append('file', {
            uri: data.uri,
            type: 'image/jpg',
            name: date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + nameFile[11],
        });
        const url = "http://picotele.com/neomitra/javacoin/klabee.php"
        return await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'multipart/form-data',
            }),
            body: formData
        }).then(response => response.json()).then(responseJson => {
            return responseJson;
        }).catch(error => {
            return { kode: 1, taregetFile: '' };
        });
    }
}
