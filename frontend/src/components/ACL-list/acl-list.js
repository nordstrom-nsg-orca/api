import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import LockIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import Typography from '@material-ui/core/Typography'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import ACL from './acl';


const test = [
  {
    "prefix-list": "REMOTE_MANAGEMENT2",
    "ips": [
      {
        "ip": "10.10.10.10/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.11/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.12/23",
        "allowed": "SNMP",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.13/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      }
    ]
  },
  {
    "prefix-list": "REMOTE_MANAGEMENT",
    "ips": [
      {
        "ip": "10.10.10.10/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.11/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.12/23",
        "allowed": "SNMP",
        "desc": "Test decription of what could actuall go here"
      },
      {
        "ip": "10.10.10.13/23",
        "allowed": "SSH",
        "desc": "Test decription of what could actuall go here"
      }
    ]
  }
];

class ACLList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: test,
      locked: false
    };
  }

  aclHandler = (action, prefixId, aclId, key, e) => {
    var copy = JSON.parse(JSON.stringify(this.state.list))

    if (action === 'add') {
      copy[prefixId]['ips'].push({'ip': 'ip', 'allowed': 'allowed', 'desc': 'desc'});
    }

    if (action === 'delete') {
      copy[prefixId]['ips'].splice(aclId, 1);
    }

    if (action === 'update') {
      if (aclId) {
        copy[prefixId]['ips'][aclId][key] = e.target.value;
      } else
        copy[prefixId]['prefix-list'] = e.target.value;
    }
    
    this.setState({
      list: copy,
      changed: true
    });
  }

  handleSave = () => {
    this.forceUpdate();
  }

  toggleLock = () => {
    this.setState({locked : !this.state.locked});
  }

  addList = () => {
    var copy = JSON.parse(JSON.stringify(this.state.list));
    copy.push({'prefix-list': 'NAME', 'ips': []});
    this.setState({
      list: copy
    })
  }

  render() {
    const { classes } = this.props;

    var lockicon, addButton; 

    if (this.state.locked) {
      lockicon = <LockIcon />;
    } else {
      lockicon = <LockOpenIcon />;
      addButton = <IconButton className={classes.addButton} onClick={this.addList}>
                    <AddIcon />
                  </IconButton>;
    }

    return (

      <div className={classes.root}>
        <div className={classes.labelBar}>
          <Typography className={classes.title} variant="h4">ACL Lists</Typography>
          <Button className={classes.save}>Save</Button>
          <IconButton onClick={this.toggleLock} className={classes.lockButton} color="inherit">
            {lockicon}
          </IconButton>
        </div>
        <List>
          {this.state.list.map((value, index) => 
            <ACL key={index} index={index} 
              acl={value} locked={this.state.locked}
              aclHandler={this.aclHandler} handleChange={this.handleChange}  />
          )}
        </List>
        {addButton}
      </div>
    );
  }

}

const styles = theme => ({
  root: {
    maxWidth: '700px',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center'
  },
  appbar: {
    backgroundColor: '#333333',
  },
  addButton: {
    '&:hover': {
      backgroundColor: 'green'
    },
    margin: 'auto',
    color: 'black',
    // marginRight: theme.spacing(2),
    backgroundColor: 'lightGreen'
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    verticalAlign: 'center',
    padding: '7px'
  },
  labelBar: {
    padding: '20px 10px 0px',
    borderBottom: '1px solid #666666',
    margin: '0px 20px',
    color: '#444444',
    display: 'flex'
  },
  lockButton: {
    marginBottom: '8px'
  },
  save:{
    width: '70px',
    height: '30px',
    margin: 'auto',
    paddingTop: '4px',
    paddingBottom: '8px'
  },
  hidden: {
    display: 'none'
  }
});

export default withStyles(styles)(ACLList);