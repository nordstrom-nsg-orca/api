import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';


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


import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { withStyles } from '@material-ui/core/styles';


class ACL extends React.Component {
  constructor(props) {
    super(props);
  }
 

  renderDeleteButton(classes,aclId) {
    if (this.props.locked) return;
    return (
      <IconButton size="small"
                  className={classes.deleteButton}
                  onClick={this.props.aclHandler.bind(this,'delete',this.props.index,aclId)}>
        <CloseIcon style={{fontSize: '18px'}}/>
      </IconButton>
    );
  }

  render() {
    const { classes } = this.props;
    const keys = ['ip', 'allowed', 'desc'];

    var addButton, deleteButton;
    if (!this.props.locked) {
      addButton = <IconButton size="small"
                    className={classes.addButton}
                    onClick={this.props.aclHandler.bind(this,'add',this.props.index,null)}>
                    <AddIcon />
                  </IconButton>;
    }

    return (
      <div className={classes.root}>
        <ListItem key={this.props.index} color="inherit">
          <ExpansionPanel key={this.props.index} className={classes.item} defaultExpanded={this.props.index == 0? true : false}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              
              <Input 
                classes={{input: classes.prefix}}
                onClick={event => { if (!this.props.locked) event.stopPropagation() }}
                disableUnderline={true}
                disabled={this.props.locked}
                value={this.props.acl['prefix-list']}
                onChange={this.props.aclHandler.bind(this,'update',this.props.index,null,null) } />
              
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{flexWrap: 'wrap'}}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cell}>Subnet</TableCell>
                    <TableCell className={classes.cell}>Allowed</TableCell>
                    <TableCell className={classes.cell} style={{width: '300px'}}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {this.props.acl['ips'].map((value, index) =>
                  <TableRow key={index}>
                  {keys.map((key, i) =>
                    <TableCell key={i} className={classes.cell}>
                      <Input 
                        classes={{input: classes[key]}}
                        disableUnderline={true}
                        disabled={this.props.locked}
                        value={value[key]} 
                        onChange={this.props.aclHandler.bind(this,'update',this.props.index,index,key) }/>
                    </TableCell>
                  )}
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
    '&:disabled': {
      fontStyle: 'normal',
      color: 'black',
    }
  },
  allowed: {
    fontSize: '14px',
    fontStyle: 'italic',
    '&:disabled': {
      fontStyle: 'normal',
      color: 'black',
    }
  },
  desc: {
    fontSize: '14px',
    fontStyle: 'italic',
    width: '300px',
    '&:disabled': {
      fontStyle: 'normal',
      color: 'black',
    }
  },
  cell: {
    padding: '2px 10px',
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
    backgroundColor: 'lightGreen'
  },
  deleteButton: {
    '&:hover': {
      backgroundColor: 'red'
    },
    padding: '0',
    margin: '7px auto',
    color: 'black',
    backgroundColor: '#ffc6c4'
  }
});

export default withStyles(styles)(ACL);