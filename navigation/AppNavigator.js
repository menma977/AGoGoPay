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
import BPJSScreen from '../screens/BPJSScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BotScreen from '../screens/bot/BotScreen';
import FibonacciScreen from '../screens/bot/FibonacciScreen';
import FibonacciBot from '../screens/bot/FibonacciBot';
import MartinAngelScreen from '../screens/bot/MartinAngelScreen';
import LabouchereScreen from '../screens/bot/LabouchereScreen';
import MartinAngelBot from '../screens/bot/MartinAngelBot';
import LabouchereBot from '../screens/bot/LabouchereBot';
import PulsePascaScreen from '../screens/PulsePascaScreen';
import PDAMScreen from '../screens/PDAMScreen';
import MultyFScreen from '../screens/MultyFScreen';
import InusernScreen from '../screens/InusernScreen';
import TopUpPPOBScreen from '../screens/TopUopPPOBScreen';
import TopUpDogeScreen from '../screens/TopUpDogeScreen';
import MoveScreen from '../screens/MoveScreen';

export default createAppContainer( createSwitchNavigator( {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Login: LoginScreen,
  Home: HomeScreen,
  HomeTab: HomeTab,
  WebViewTab: WebViewTab,
  Logger: LoggerScreen,
  Financial: FinancialScreen,
  topUpPPOB: TopUpPPOBScreen,
  topUpDoge: TopUpDogeScreen,
  bot: BotScreen,
  martinAngel: MartinAngelScreen,
  fibonacci: FibonacciScreen,
  labouchere: LabouchereScreen,
  move: MoveScreen,

  fibonacciBot: FibonacciBot,
  martinAngelBot: MartinAngelBot,
  labouchereBot: LabouchereBot,

  pulse: PulseScreen,
  pulsePasca: PulsePascaScreen,
  insuren: InusernScreen,
  multyF: MultyFScreen,
  PDAM: PDAMScreen,
  PLN: PLNScreen,
  PLNPasca: PLNPascaScreen,
  ovo: OvoScreen,
  gojek: GojekScreen,
  grab: GrabScreen,
  eMoneyMandiri: EMoneyMandiri,
  eMoneyBNI: EMoneyBNIScreen,
  wifi: WifiScreen,
  bpjs: BPJSScreen,
  payment: PaymentScreen
} ) );