import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function TopicSelection(props) {

  const [topicMenuRef, setTopicMenuRef] = React.useState(null)

  return (
    <React.Fragment>
      <Paper elevation={1}>
        <List component="nav">
          <ListItem button onClick={(event) => { setTopicMenuRef(event.currentTarget) }}>
            <ListItemText primary="Question Topic" secondary={props.topic} />
          </ListItem>
        </List>
      </Paper>
      <Menu
        anchorEl={topicMenuRef}
        keepMounted
        open={Boolean(topicMenuRef)}
        onClose={() => { setTopicMenuRef(null) }}
      >
        <MenuItem id={"Baby Bonus"}
          onClick={(e) => {
            props.setTopic(e.target.id)
            setTopicMenuRef(null)
          }}
        >
          Baby Bonus
        </MenuItem>
        <MenuItem id={"Covid 19"}
          onClick={(e) => {
            props.setTopic(e.target.id)
            setTopicMenuRef(null)
          }}
        >
          Covid 19
        </MenuItem>
        <MenuItem id={"ComCare"}
          onClick={(e) => {
            props.setTopic(e.target.id)
            setTopicMenuRef(null)
          }}
        >
          ComCare
        </MenuItem>
        <MenuItem id={"Adoption"}
          onClick={(e) => {
            props.setTopic(e.target.id)
            setTopicMenuRef(null)
          }}
        >
          Adoption
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
