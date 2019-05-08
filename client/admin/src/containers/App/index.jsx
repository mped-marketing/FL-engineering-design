/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/extensions */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LocaleProvider, notification, Icon } from 'antd';
import { IntlProvider } from 'react-intl';
import axios from 'axios';
import AppLocale from 'lngProvider';
import { setInitUrl } from 'appRedux/actions/Auth';
import {
  getNotifications,
  setNotifications,
} from 'appRedux/actions/Notifications';
import {
  getOpations,
} from 'appRedux/actions/opations';
import Cookies from 'js-cookie';

import {
  onLayoutTypeChange,
  onNavStyleChange,
  setThemeType,
} from 'appRedux/actions/Setting';
import decode from 'jwt-decode';
import MainApp from './MainApp';
import SignIn from '../SignIn.jsx';
import reset from '../Reset.jsx';
import updatePassword from '../updatePassword.jsx';

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
} from '../../constants/ThemeSetting';

const checkJwt = (token) => {
  let auth = false;
  try {
    const authResult = decode(auth);
    auth = true;
    return auth;
  } catch (error) {
    auth = false;
    return auth;
  }
};
const RestrictedRoute = ({
  component: Component, authUser, role, ...rest
}) => (
  <Route
    {...rest}
    render={props => (authUser && role ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/admin/signin',
          state: { from: props.location },
        }}
      />
    ))
      }
  />
);


class App extends Component {
  state = {};

  componentWillMount() {
    this.props.getOpations();
    // this.props.getNotifications();
    if (this.props.url === '/admin') {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
    const params = new URLSearchParams(this.props.location.search);
    if (params.has('theme')) {
      this.props.setThemeType(params.get('theme'));
    }
    if (params.has('nav-style')) {
      this.props.onNavStyleChange(params.get('nav-style'));
    }
    if (params.has('layout-type')) {
      this.props.onLayoutTypeChange(params.get('layout-type'));
    }
  }

  setLayoutType = (layoutType) => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('full-layout');
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove('full-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('boxed-layout');
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('full-layout');
      document.body.classList.add('framed-layout');
    }
  };

  setNavStyle = (navStyle) => {
    if (
      navStyle === NAV_STYLE_DEFAULT_HORIZONTAL
      || navStyle === NAV_STYLE_DARK_HORIZONTAL
      || navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL
      || navStyle === NAV_STYLE_ABOVE_HEADER
      || navStyle === NAV_STYLE_BELOW_HEADER
    ) {
      document.body.classList.add('full-scroll');
      document.body.classList.add('horizontal-layout');
    } else {
      document.body.classList.remove('full-scroll');
      document.body.classList.remove('horizontal-layout');
    }
  };


  render() {
    const {
      match,
      location,
      layoutType,
      navStyle,
      locale,
      authUser,
      url,
      role,
      notificationsNumber,
    } = this.props;
    if (location.pathname === '/admin') {
      if (authUser === null) {
        localStorage.clear();
        Cookies.remove('jwt');
        return <Redirect to="/admin/signin" />;
      }

      if (authUser && role === undefined) {
        localStorage.clear();
        Cookies.remove('jwt');
        return <Redirect to="/admin/signin" />;
      }
      if (url === '/admin' || url === '/admin/signin') {
        return <Redirect to="/admin/main" />;
      }
      return <Redirect to="/admin/main" />;
    }
    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    const currentAppLocale = AppLocale[locale.locale];
    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <Switch>
            <Route exact path="/admin/signin" component={SignIn} />
            <Route exact path="/admin/resetpassword" component={reset} />
            <Route exact path="/admin/reset/:hash" component={updatePassword} />
            <RestrictedRoute
              path={`${match.url}`}
              authUser={authUser}
              component={MainApp}
              role={role}
            />
          </Switch>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth, notifications }) => {
  const { locale, navStyle, layoutType } = settings;
  const { authUser, url, role } = auth;
  const { notificationsNumber } = notifications;
  return {
    locale,
    navStyle,
    layoutType,
    authUser,
    url,
    role,
    notificationsNumber,
  };
};

export default connect(
  mapStateToProps,
  {
    setInitUrl,
    setThemeType,
    onNavStyleChange,
    onLayoutTypeChange,
    getNotifications,
    setNotifications,
    getOpations,
  },
)(App);
