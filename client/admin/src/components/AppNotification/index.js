import React from 'react';
import CustomScrollbars from 'util/CustomScrollbars';
import Auxiliary from 'util/Auxiliary';
import axios from 'axios';
import { notification, Icon, Spin } from 'antd';
import { connect } from 'react-redux';
import socket from 'socket.io-client';
import NotificationItem from './NotificationItem';
import { getAllNotifications, setNotifications } from '../../appRedux/actions/Notifications';

class AppNotification extends React.Component {
  state= { data: [], loading: true }


  componentWillMount() {
    this.props.getAllNotifications();
  }

  componentWillReceiveProps() {
    if (this.props.allNotifications.length) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { data, loading } = this.state;
    const { allNotifications } = this.props;
    return (
      <Auxiliary>
        <div className="gx-popover-header">
          <h3 className="gx-mb-0">Notifications</h3>
        </div>
        <CustomScrollbars className="gx-popover-scroll">
          <div className="not-ul">
            <ul className="gx-sub-popover">
              <Spin spinning={!allNotifications}>
                {allNotifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    notification={notification}
                  />
                ))
            }
              </Spin>
            </ul>
          </div>
        </CustomScrollbars>
      </Auxiliary>
    );
  }
}
const mapStateToProps = ({ notifications }) => {
  const { allNotifications, notificationsNumber } = notifications;
  return { allNotifications, notificationsNumber };
};

export default connect(mapStateToProps, { getAllNotifications, setNotifications })(AppNotification);
