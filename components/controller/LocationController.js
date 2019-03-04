import React from 'react';
import { Permissions, Location } from 'expo';

export default class LocationController extends React.Component {
    async getLocation() {
        let data = { isLocationActive: false, latitude: 0, longitude: 0 };
        try {
            let getLocation = await Permissions.askAsync(Permissions.LOCATION);
            if (getLocation.status == null) {
                data = { isLocationActive: null, latitude: 0, longitude: 0 };
                return data;
            } else if (getLocation.status == false) {
                return data;
            } else {
                var getCurrentPosition = await Location.getCurrentPositionAsync({});
                data = { isLocationActive: true, latitude: getCurrentPosition.coords.latitude, longitude: getCurrentPosition.coords.longitude };
                return data;
            }
        } catch (error) {
            return data;
        }
    }
}