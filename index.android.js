/**
 * GitHubPopular
 * @flow
 */

import {
	Alert,
    AppRegistry,
} from 'react-native'
import setup from './js/page/setup';






 XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;



AppRegistry.registerComponent('GitHubPopular', () => setup);
