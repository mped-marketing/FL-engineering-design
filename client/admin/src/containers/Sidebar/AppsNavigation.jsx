import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { notification, Icon } from 'antd';

import { connect } from 'react-redux';
import axios from 'axios';
import { getNotifications, setNotifications } from '../../appRedux/actions/Notifications';

class AppsNavigation extends React.Component {
state = {
  notificationsNumber: '',
}


// componentWillMount() {
//   let unRead = 0;
//   axios.get('/api/v2/notification/getNotifications').then((result) => {
//     const { data } = result;
//     data.map((notification) => {
//       if (!notification.seen) { unRead += 1; }
//       return unRead;
//     });
//     this.setState(() => ({ notificationsNumber: unRead }));
//   });
// }


render() {
  const { notificationsNumber } = this.state;
  return (
    <ul className="gx-app-nav">
      <li><i className="icon icon-search-new" /></li>
      <li className="notification-button">
        <Link to="/notification">
          <i className="icon icon-notification" />
          <span className="badge">{notificationsNumber}</span>
        </Link>
      </li>
      <li>
        <i className="icon icon-chat-new" />
      </li>
    </ul>

  );
}
}
AppsNavigation.propTypes = {};
const mapStateToProps = ({ notifications }) => {
  const { notificationsNumber } = notifications;

  return {
    notificationsNumber,
  };
};
export default connect(mapStateToProps, { getNotifications, setNotifications })(AppsNavigation);
