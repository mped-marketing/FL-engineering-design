import React, { Component } from 'react';
import { Layout, Popover } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import CustomScrollbars from 'util/CustomScrollbars';
import SearchBox from 'components/SearchBox';
import UserInfo from 'components/UserInfo';
import AppNotification from 'components/AppNotification';
import MailNotification from 'components/MailNotification';
import Auxiliary from 'util/Auxiliary';
import axios from 'axios';
import { notification, Icon } from 'antd';
import { connect } from 'react-redux';
import socket from 'socket.io-client';
import { setNotifications, getAllNotifications } from '../../appRedux/actions/Notifications';
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from '../../constants/ThemeSetting';
import {
  switchLanguage,
  toggleCollapsedSideNav,
} from '../../appRedux/actions/Setting';
import languageData from './languageData';

const { Header } = Layout;

class Topbar extends Component {
  state = {
    searchText: '',
    notificationsNumber: '',
    users: [],
  };

io = socket(`${window.location.origin}`, { transports: ['websocket'], upgrade: false, forceNew: false })

componentDidMount() {
  // this.getNotification();
  this.io.on('connect', () => {
    this.io.on('newComment', (data) => {
      const { message } = data;
      notification.open({
        message: 'New Comment',
        description: message,
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        duration: 2,
      });

      // this.getNotification();
      // this.props.getAllNotifications();
      const { notificationsNumber } = this.state;
      this.setState(() => ({ notificationsNumber: notificationsNumber + 1 }));
    });

    const { role } = this.props;
    if (role === 'admin') {
      this.io.on('newPost', (data) => {
        const { message } = data;
        notification.open({
          message: 'New Post',
          description: message,
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
          duration: 2,
        });
        // this.getNotification();
        // this.props.getAllNotifications();
        const { notificationsNumber } = this.state;
        this.setState(() => ({ notificationsNumber: notificationsNumber + 1 }));
      });
    }
  });
}

componentWillUnmount() {
  this.io.close();
}

getNotification = () => {
  let unRead = 0;
  axios.get('/api/v2/notification/getNotifications').then((result) => {
    const { data } = result;
    data.map((notification) => {
      if (!notification.seen) { unRead += 1; }
      return unRead;
    });
    this.setState(() => ({ notificationsNumber: unRead }));
  });
}


  languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map(language => (
          <li
            className="gx-media gx-pointer"
            key={JSON.stringify(language)}
            onClick={e => this.props.switchLanguage(language)}
          >
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        ))}
      </ul>
    </CustomScrollbars>
  );

  seenNotifications = async () => {
    this.setState(() => ({ notificationsNumber: 0 }));
    await axios.post('/api/v2/notification/seenNotification');
  }

  updateSearchChatUser = (evt) => {
    this.setState({
      searchText: evt.target.value,
    });
  };

  handleKeyPress = (e) => {
    const { searchText } = this.state;
    if (e.key === 'Enter') {
      axios.post('/api/v2/search', { searchData: searchText }).then((result) => {
        const { data } = result;
        localStorage.setItem('searchData', JSON.stringify(data));
        this.props.history.push('/admin/search');
      }).catch((error) => {
        this.props.history.push('/admin/search');
      });
    }
  }

  render() {
    const {
      locale, width, navCollapsed, navStyle,
    } = this.props;
    const { notificationsNumber } = this.state;
    return (
      <Auxiliary>
        <Header>
          {navStyle === NAV_STYLE_DRAWER
          || ((navStyle === NAV_STYLE_FIXED
            || navStyle === NAV_STYLE_MINI_SIDEBAR)
            && width < TAB_SIZE) ? (
              <div className="gx-linebar gx-mr-3">
                <i
                  className="gx-icon-btn icon icon-menu"
                  onClick={() => {
                    this.props.toggleCollapsedSideNav(!navCollapsed);
                  }}
                />
              </div>
            ) : null}

          <SearchBox
            onKeyPress={this.handleKeyPress}
            styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
            placeholder="Search in app..."
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.state.searchText}
          />
          <ul className="gx-header-notifications gx-ml-auto">
            <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
              <Popover
                overlayClassName="gx-popover-horizantal"
                placement="bottomRight"
                content={(
                  <SearchBox
                    styleName="gx-popover-search-bar"
                    placeholder="Search in app..."
                    onChange={this.updateSearchChatUser.bind(this)}
                    value={this.state.searchText}
                  />
)}
                trigger="click"
              >
                <span className="gx-pointer gx-d-block">
                  <i className="icon icon-search-new" />
                </span>
              </Popover>
            </li>

            <Auxiliary>
              {/* <li className="gx-notify notification-button" onClick={this.seenNotifications}>
                <Popover
                  overlayClassName="gx-popover-horizantal"
                  placement="bottomRight"
                  content={<AppNotification />}
                  trigger="click"
                >
                  <span className="gx-pointer gx-d-block">
                    <i className="icon icon-notification" />
                    <span className="badge">{notificationsNumber > 99 ? '+99' : notificationsNumber}</span>
                  </span>
                </Popover>
              </li> */}

              {/* <li className="gx-msg">
                <Popover
                  overlayClassName="gx-popover-horizantal"
                  placement="bottomRight"
                  content={<MailNotification />}
                  trigger="click"
                >
                  <span className="gx-pointer gx-status-pos gx-d-block">
                    <i className="icon icon-chat-new" />
                    <span className="gx-status gx-status-rtl gx-small gx-orange" />
                  </span>
                </Popover>
              </li> */}
              <li className="gx-user-nav">
                <UserInfo />
              </li>
            </Auxiliary>

            {/* <li className="gx-language">
              <Popover
                overlayClassName="gx-popover-horizantal"
                placement="bottomRight"
                content={this.languageMenu()}
                trigger="click"
              >
                <span className="gx-pointer gx-flex-row gx-align-items-center">
                  <i className={`flag flag-24 flag-${locale.icon}`} />
                  <span className="gx-pl-2 gx-language-name">
                    {locale.name}
                  </span>
                  <i className="icon icon-chevron-down gx-pl-2" />
                </span>
              </Popover>
            </li> */}
            {/* {width >= TAB_SIZE ? null : (
              <Auxiliary>
                <li className="gx-user-nav">
                  <UserInfo />
                </li>
              </Auxiliary>
            )} */}
          </ul>
        </Header>
      </Auxiliary>
    );
  }
}

const mapStateToProps = ({ settings, notifications, auth }) => {
  const {
    locale, navStyle, navCollapsed, width,
  } = settings;
  const { notificationsNumber } = notifications;
  const { role, socket } = auth;
  return {
    locale,
    navStyle,
    navCollapsed,
    width,
    notificationsNumber,
    role,
    socket,
  };
};

export default connect(
  mapStateToProps,
  {
    toggleCollapsedSideNav, switchLanguage, setNotifications, getAllNotifications,
  },
)(withRouter(Topbar));
