import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import HomeTab from '../screens/tab/HomeTab';
import WebViewTab from '../screens/tab/WebViewTab';
import LoginScreen from '../screens/LoginScreen';
import PulseScreen from '../screens/PulseScreen';

export default createAppContainer( createSwitchNavigator( {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Login: LoginScreen,
  Home: HomeScreen,
  HomeTab: HomeTab,
  WebViewTab: WebViewTab,

  pulse: PulseScreen
} ) );