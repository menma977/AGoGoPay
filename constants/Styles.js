import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
    },
    alignItemStart: {
        alignItems: 'flex-start',
    },
    alignItemCenter: {
        alignItems: 'center',
    },
    alignItemEnd: {
        alignItems: 'flex-end',
    },
    alignSelfStart: {
        alignSelf: 'flex-start',
    },
    alignSelfCenter: {
        alignSelf: 'center',
    },
    alignSelfEnd: {
        alignSelf: 'flex-end',
    },
    justifyContentStart: {
        justifyContent: 'flex-start',
    },
    justifyContentCenter: {
        justifyContent: 'center',
    },
    justifyContentEnd: {
        justifyContent: 'flex-end',
    },
    bgTransparent: {
        backgroundColor: 'transparent',
    },
    bgOrange: {
        backgroundColor: '#ffa81d',
    },
    colorBlack: {
        color: '#000000',
    },
    colorOrange: {
        color: '#ffa81d',
    }
})

export default styles;