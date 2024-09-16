import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    marginBottom: theme.spacing(2),
    height: "5em",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  barItems: {
    margin: theme.spacing(2),
  },
  bottomBarPaper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export default function Settings(props) {
  const classes = useStyles();
  const [deleteTopicDialog, setDeleteTopicDialog] = React.useState(false);

  return (
    <React.Fragment>
      <Paper className={classes.topBarPaper}>
        <Typography variant="h5" className={classes.barItems}>
          Settings
        </Typography>
      </Paper>
      <Paper className={classes.bottomBarPaper}>
        <div className={classes.barItems}>
          <Typography variant="h6">Delete Topic</Typography>
          <Typography>
            Are you sure you want to delete this topic? All questions and
            answers will be removed and cannot be recovered.
          </Typography>
        </div>
        <Button
          variant="contained"
          color="secondary"
          className={classes.barItems}
          onClick={() => {
            setDeleteTopicDialog(true);
          }}
        >
          Delete
        </Button>
      </Paper>

      {/* Dialogbox for deleting topic */}
      <Dialog
        open={deleteTopicDialog}
        onClose={() => {
          setDeleteTopicDialog(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this topic?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted, questions and answers cannot be retrieved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              props.deleteTopic(props.currentTopic).then(() => {
                props.setCurrentTopic("");
                setDeleteTopicDialog(false);
              });
            }}
          >
            Delete Topic
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => {
              setDeleteTopicDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
