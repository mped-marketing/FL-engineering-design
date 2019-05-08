import React from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import './style.css';

const NotificationItem = ({ notification }) => {
  const {
    text, image, email, createdAt, seen,
  } = notification;

  return (

    <li className={`gx-media ${!seen ? 'not-seen-not' : null}`}>
      <div className="gx-media-body gx-align-self-center">
        <p className="gx-fs-sm gx-mb-0">{text}</p>
        <i className="chat gx-text-grey" />
        <span>{seen}</span>
        <span className="gx-meta-date"><small>{seen}</small></span>
      </div>
    </li>
  );
};

export default NotificationItem;
