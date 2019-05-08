import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import IntlMessages from '../../util/IntlMessages';
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
} from '../../constants/ThemeSetting';


const { SubMenu } = Menu;

class HorizontalNav extends Component {
  getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve';
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve';
      case NAV_STYLE_BELOW_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve';
      case NAV_STYLE_ABOVE_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve';
      default:
        return 'gx-menu-horizontal';
    }
  };

  render() {
    const { pathname, navStyle } = this.props;
    const {
      themeType, role, authUser,
    } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (

      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
      >

        <SubMenu
          className={this.getNavStyleSubMenuClass(navStyle)}
          key="main"
          title={<IntlMessages id="sidebar.main" />}
        >
          <Menu.Item key="sample">
            <Link to="/sample">
              <i className="icon icon-widgets" />
              <IntlMessages id="sidebar.samplePage" />

            </Link>
          </Menu.Item>
        </SubMenu>
        {role === 'admin' ? (
          <SubMenu
            key="users"
            className={this.getNavStyleSubMenuClass(navStyle)}
            title={(
              <span>
                {' '}
                <IntlMessages id="sidebar.users" />
              </span>
)}
          >
            <Menu.Item key="users/view">
              <Link to="/users/view">
                <i className="icon icon-user-o" />
                <IntlMessages id="sidebar.viewusers" />
              </Link>
            </Menu.Item>
            <Menu.Item key="users/adduser">
              <Link to="/users/adduser">
                <i className="icon icon-add" />
                <IntlMessages id="sidebar.adduser" />
              </Link>
            </Menu.Item>
          </SubMenu>
        ) : null}
        <SubMenu
          key="posts"
          className={this.getNavStyleSubMenuClass(navStyle)}
          title={(
            <span>
              <IntlMessages id="sidebar.posts" />
            </span>
)}
        >
          <Menu.Item key="Posts/viewPosts">
            <Link to="/Posts/viewPosts">
              <i className="icon icon-product-list" />
              <IntlMessages id="sidebar.posts.view" />
            </Link>
          </Menu.Item>
          <Menu.Item key="Posts/addPost">
            <Link to="/Posts/addPost">
              <i className="icon icon-product-list" />
              <IntlMessages id="sidebar.posts.add" />
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="categories"
          className={this.getNavStyleSubMenuClass(navStyle)}
          title={(
            <span>
              {' '}
              <IntlMessages id="sidebar.categories" />
            </span>
)}
        >
          <Menu.Item key="Categories/Main">
            <Link to="/Categories/Main">
              <i className="icon icon-product-list" />
              <IntlMessages id="sidebar.mainCategories" />
            </Link>
          </Menu.Item>
          <Menu.Item key="Categories/Add">
            <Link to="/Categories/Add">
              <i className="icon icon-add" />
              <IntlMessages id="sidebar.addCategory" />
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="comments">
          <Link to="/comments/all">
            <i className="icon icon-chat" />
            <IntlMessages id="sidebar.comments" />
          </Link>
        </Menu.Item>
        <Menu.Item key="options">
          <Link to="/options">
            <i className="icon icon-widgets" />
            <IntlMessages id="sidebar.options" />
          </Link>
        </Menu.Item>
        <Menu.Item key="newsletter">
          <Link to="/newsletter">
            <i className="icon icon-chat" />
            <IntlMessages id="sidebar.newsletter" />
          </Link>
        </Menu.Item>
      </Menu>

    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({ settings, auth }) => {
  const {
    themeType, navStyle, pathname, locale,
  } = settings;
  const { role, authUser } = auth;

  return {
    themeType, navStyle, pathname, locale, authUser, role,
  };
};
export default connect(mapStateToProps)(HorizontalNav);
