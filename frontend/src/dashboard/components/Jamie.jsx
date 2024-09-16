import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formcontrol: {
    width: '100%',
  },
  textfield: {
    "& .MuiInputBase-input.Mui-disabled": {
      color: 'black'
    },
  }
}))

export default function Jamie(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <FormControl variant="outlined" className={classes.formcontrol}>
        <TextField
          style={{ width: '100%' }}
          id="outlined-multiline-static"
          className={classes.textfield}
          label="Ask Jamie"
          multiline
          rows="10"
          variant="outlined"
          disabled
          value={props.loadingJamie ? "loading..." : props.responseJamie}
        />
      </FormControl>
    </React.Fragment>
  );
}
