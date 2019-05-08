import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Card, Button } from 'antd';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import Logo from '../Logo';
import Social from '../Social';
import Footer from '../Footer';
import ContactUs from '../ContactUs';
import General from '../General';
import Additional from '../Additional';
import './style.css';

const { TabPane } = Tabs;

class index extends Component {
    state = {}

goToHome = () => {
  this.props.history.push('/admin/main');
}

onSave = () => {
  const { values } = this.props;
  axios
    .post('/api/v2/option', values)
    .then((result) => {
      const {
        data: { message },
        statusText,
      } = result;
      if (result.status === 200) {
        NotificationManager.success(message, 'SUCCESS', 2000);
        setTimeout(() => {
          this.setState({ disable: false });
        }, 3000);
      } else {
        NotificationManager.error(message || statusText, 'ERROR', 2000);
        setTimeout(() => {
          this.setState({ disable: false });
        }, 2000);
      }
    })
    .catch((error) => {
      const {
        response: {
          data: { message },
        },
      } = error;
      NotificationManager.error(message, 'ERROR', 2000);
      setTimeout(() => {
        this.setState({ disable: false });
      }, 2000);
    });
}

render() {
  const { role } = this.props;
  return (
    <Card className="gx-card" title="Settings">
      <div className="buttons">
        <Button className="spec--button" onClick={this.goToHome}>Cancel</Button>
        <Button className="spec--button" onClick={this.onSave}>Save</Button>
      </div>
      <Tabs>

        {role !== 'admin' ? (
          <TabPane disabled tab="General Settings" key="1" style={{ color: 'red' }}>
            <General />
          </TabPane>
        ) : (
          <TabPane tab="General Settings" key="1" style={{ color: 'red' }}>
            <General />
          </TabPane>
        )}

        <TabPane tab="Contact Us" key="2">
          <ContactUs />
        </TabPane>

        <TabPane tab="Social Media" key="3">
          <Social />
        </TabPane>

        <TabPane tab="Style" key="4">
          <Logo />
        </TabPane>

        {role !== 'admin' ? (
          <TabPane disabled tab="Additional Codes" key="5">
            <Additional />
          </TabPane>
        ) : (
          <TabPane tab="Additional Codes" key="5">
            <Additional />
          </TabPane>
        )}

        <TabPane tab="Footer" key="6">
          <Footer />
        </TabPane>

      </Tabs>
      <NotificationContainer />
    </Card>
  );
}
}

const mapStateToProps = ({ auth, opations, form }) => {
  const { role } = auth;
  const { opations: options } = opations;
  const { values } = form;
  return {
    role,
    options,
    values,
  };
};
export default connect(mapStateToProps)(index);
