import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  formcontrol: {
    width: "100%",
  },
  textfield: {
    "& .MuiInputBase-input.Mui-disabled": {
      color: "black",
    },
  },
}));

export default function AnswerModel(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <FormControl variant="outlined" className={classes.formcontrol}>
        <TextField
          id="outlined-multiline-static"
          className={classes.textfield}
          label={props.value}
          multiline
          rows="10"
          variant="outlined"
          disabled
          helperText={
            props.value !== "AskJamie"
              ? props.score
                ? "Similarity Score: " + props.score
                : "Comparison Inactive"
              : undefined
          }
          value={props.loading ? "loading..." : props.response}
        />
      </FormControl>
    </React.Fragment>
  );
}
