import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Divider from '@material-ui/core/Divider';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { withStyles } from '@material-ui/core/styles';


class ACL extends React.Component {
  constructor(props) {
    super(props);
  }
 
  handleChange = (e) => {
    console.log('hey');
  }

  addACL = () => {
    console.log('addacl');
    this.props.acl['ips'].push({'ip': 'IP', 'allowed': 'allowed'});
    console.log(this.props.acl['ips']);
  }

  render() {

    const { classes } = this.props;

    var addButton;
    if (!this.props.locked) {
      addButton = <IconButton size="small" className={classes.addButton} onClick={this.props.addACL}>
                    <AddIcon />
                  </IconButton>;
    }

    return (
      <div className={classes.root}>
        <ListItem color="inherit">
          <ExpansionPanel className={classes.item}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              
              <Input 
                classes={{input: classes.prefix}}
                onClick={event => { if (!this.props.locked) event.stopPropagation() }}
                disableUnderline={true}
                disabled={this.props.locked}
                defaultValue={this.props.acl['prefix-list']} />
              
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subnet</TableCell>
                    <TableCell>Allowed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.props.acl['ips'].map((value, index) => 
                  <TableRow>
                    <TableCell>
                      <Input 
                        classes={{input: classes.ip}}
                        disableUnderline={true}
                        disabled={this.props.locked}
                        defaultValue={value['ip']} />
                    </TableCell>
                    <TableCell>
                      <Input 
                        classes={{input: classes.ip}}
                        disableUnderline={true}
                        disabled={this.props.locked}
                        defaultValue={value['allowed']} />
                    </TableCell>
                  </TableRow>
                )}
                </TableBody>
              </Table>
              {addButton}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </ListItem>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
  },

  item: {
    border: '1px solid #eeeeee',
    width: '100%',
    '&:focus': {
      backgroundColor: '#ff00ff'
    }
  },
  prefix: {
    width: '300px',
    paddingBottom: '6px',
    fontStyle: 'italic',
    overflow: 'show',
    '&:disabled': {
      fontStyle: 'normal',
      color: 'black',
      border: 'none',
      cursor: 'pointer'
    }
  },
  ip: {
    fontSize: '14px',
    fontStyle: 'italic',
    overflow: 'show',
    '&:disabled': {
      fontStyle: 'normal',
      color: 'black',
    }
  },
  editButton: {
    margin: 'auto',
    marginTop: '20px'
  },
  addButton: {
    '&:hover': {
      backgroundColor: 'green'
    },
    margin: '10px auto',
    color: 'black',
    // marginRight: theme.spacing(2),
    backgroundColor: 'lightGreen'
  }
});

export default withStyles(styles)(ACL);