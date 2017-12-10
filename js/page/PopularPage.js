/**
 * PopularPage
 * @flow
 */
'use strict';
import React, {Component} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableHighlight,
    Text,
    Image,
    View,
} from 'react-native'


import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import MoreMenu, {MORE_MENU} from '../common/MoreMenu'
import CustomTheme from "./my/CustomTheme"
import SearchPage from "./SearchPage"
 
import {FLAG_TAB} from './HomePage'
import LanguageDao, {FLAG_LANGUAGE}  from '../expand/dao/LanguageDao'
 
import Utils from '../util/Utils'

import PopularTab from './PopularTab'
 
 

export default class PopularPage extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: [],
            customThemeViewVisible: false,
            theme: this.props.theme,
        };
    }
 


    componentDidMount() {
        // console.log("!!!!!!!!!!!!!!!!99!!!!>>>");  
        
        // console.log(this.props);  
        // console.log("!!!!!!!!!!!!this.props this.props this.props");  
        
        this.props.homeComponent.addSubscriber(this.onSubscriber);
        this.loadLanguage();
    }

    componentWillUnmount() {
        this.props.homeComponent.removeSubscriber(this.onSubscriber);
    }

    onSubscriber = (preTab, currentTab)=> {
        var changedValues = this.props.homeComponent.changedValues;
        if (changedValues.my.themeChange && preTab.styles) {
            this.setState({
                theme: preTab
            })
            return;
        }
        if (currentTab != FLAG_TAB.flag_popularTab)return;
        if (FLAG_TAB.flag_popularTab === currentTab && changedValues.my.keyChange) {//从设置页面切换过来
            this.props.homeComponent.onReStart(FLAG_TAB.flag_popularTab);
        }
    }

    loadLanguage() {
        this.languageDao.fetch().then((languages)=> {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error)=> {

        });
    }

    renderMoreButton() {
        return (
            <View style={{flexDirection: 'row',}}>
                <TouchableHighlight
                    ref='button'
                    underlayColor='transparent'
                    onPress={()=>{
                        this.props.navigator.push({
                            component: SearchPage,
                            params: {
                                theme:this.state.theme,
                                ...this.props,
                            },
                        });
                    }}>
                    <View style={{padding:5}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../res/images/ic_search_white_48pt.png')}
                        />
                    </View>
                </TouchableHighlight>
                {ViewUtils.getMoreButton(()=>this.refs.moreMenu.open())}
            </View>)
    }

    renderMoreView() {
        let params = {...this.props, theme: this.state.theme,fromPage:FLAG_TAB.flag_popularTab}
        return <MoreMenu
            {...params}
            ref="moreMenu"
            menus={[MORE_MENU.Sort_Key, MORE_MENU.Custom_Key,MORE_MENU.Remove_Key, MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About,MORE_MENU.Feedback]}
            contentStyle={{right: 20}}
            onMoreMenuSelect={(e)=> {
                if (e === MORE_MENU.Custom_Theme) {
                    this.setState({customThemeViewVisible: true});
                }
            }}
            anchorView={this.refs.moreMenuButton}
            navigator={this.props.navigator}/>
    }

    render() {
        var content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineColor='#e7e7e7'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarBackgroundColor={this.state.theme.themeColor}
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40,borderWidth:0,elevation:2}} tabStyle={{height: 39}}
                                                      underlineHeight={2}/>}
            >
                {this.state.languages.map((result, i, arr)=> {
                    var language = arr[i];
                    return language && language.checked ?
                        <PopularTab key={i} {...this.props} theme={this.state.theme}
                                    tabLabel={language.name}/> : null;
                })}
            </ScrollableTabView>
            : null;
        var statusBar={
            backgroundColor:this.state.theme.themeColor,
        }
        
        let navigationBar =
            <NavigationBar
                title='Popular'
                style={this.state.theme.styles.navBar}
                rightButton={this.renderMoreButton()}
                statusBar={statusBar}
                hide={false}/>;
        let customThemeView =
            <CustomTheme
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={()=> {
                    this.setState({customThemeViewVisible: false})
                }}/>
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {customThemeView}
                {this.renderMoreView()}
            </View>
        );
    }

}


 
var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
