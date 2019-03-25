import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import HomeTab from '../screens/tab/HomeTab';
import WebViewTab from '../screens/tab/WebViewTab';
import LoginScreen from '../screens/LoginScreen';
import PulseScreen from '../screens/PulseScreen';
import PLNScreen from '../screens/PLNScreen';
import LoggerScreen from '../screens/LoggerScreen';
import FinancialScreen from '../screens/FinancialScreen';
import OvoScreen from '../screens/OvoScreen';
import GojekScreen from '../screens/GojekScreen';
import GrabScreen from '../screens/GrabScreen';
import EMoneyMandiri from '../screens/EMoneyMandiri';
import EMoneyBNIScreen from '../screens/EMoneyBNIScreen';
import WifiScreen from '../screens/WifiScreen';
import PLNPascaScreen from '../screens/PLNPascaScreen';
import TVScreen from '../screens/TVScreen';
import BPJSScreen from '../screens/BPJSScreen';
import PaymentScreen from '../screens/PaymentScreen';

export default createAppContainer( createSwitchNavigator( {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Login: LoginScreen,
  Home: HomeScreen,
  HomeTab: HomeTab,
  WebViewTab: WebViewTab,
  Logger: LoggerScreen,
  Financial: FinancialScreen,

  pulse: PulseScreen,
  PLN: PLNScreen,
  PLNPasca: PLNPascaScreen,
  ovo: OvoScreen,
  gojek: GojekScreen,
  grab: GrabScreen,
  eMoneyMandiri: EMoneyMandiri,
  eMoneyBNI: EMoneyBNIScreen,
  wifi: WifiScreen,
  tv: TVScreen,
  bpjs: BPJSScreen,
  payment: PaymentScreen
} ) );