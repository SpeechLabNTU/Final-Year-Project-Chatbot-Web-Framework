import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TablePaginationActions from "../components/TablePaginationActions";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import Collapse from "@material-ui/core/Collapse";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    height: "5em",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topBarItems: {
    margin: theme.spacing(2),
  },
  bodyPaper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topHeader: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    whiteSpace: "nowrap",
  },
  bodyHeader: {
    margin: theme.spacing(3),
  },
  bodyText: {
    flex: 1,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    whiteSpace: "pre-line",
    "& .MuiInputBase-input.Mui-disabled": {
      color: "black",
    },
  },
  questionInput: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tableContainer: {
    marginRight: theme.spacing(5),
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  tableRow: {
    display: "flex",
  },
  tableCell: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    "& .MuiInputBase-input.Mui-disabled": {
      color: "black",
    },
  },
  tableCellText: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function SingleQuestion(props) {
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newAnswer, setNewAnswer] = React.useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [altPhrases, setAltPhrases] = React.useState([]);
  const [altPhrasesCopy, setAltPhrasesCopy] = React.useState([]);
  const [phrasesChanged, setPhrasesChanged] = React.useState(false);
  const [newAlt, setNewAlt] = React.useState("");
  const [editAltPhrase, setEditAltPhrase] = React.useState([]);

  const classes = useStyles();

  React.useEffect(() => {
    setEditAltPhrase(altPhrases.map(() => false));
    setAltPhrasesCopy(altPhrases);
  }, [altPhrases]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={2}>
      <Grid container item>
        <Paper className={classes.topBarPaper} style={{ flex: 1 }}>
          <Typography variant="h5" className={classes.topHeader}>
            Add New Question
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              className={classes.topBarItems}
              variant="contained"
              color="primary"
              disabled={newQuestion.trim() === "" || newAnswer.trim() === ""}
              onClick={() => {
                // TODO: check if question already exists
                props
                  .createIntent({
                    question: newQuestion.trim(),
                    answer: newAnswer.trim(),
                    similarQuestions: altPhrases.map(val => val.trim()),
                  })
                  .then((res) => {
                    props.setAddNewIntent(false);
                  });
              }}
            >
              Save
            </Button>
            <Button
              className={classes.topBarItems}
              variant="contained"
              color="primary"
              onClick={() => {
                props.setAddNewIntent(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Paper>
      </Grid>

      <Grid item container>
        <Paper className={classes.bodyPaper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" className={classes.bodyHeader}>
              Question:
            </Typography>
          </div>
          <TextField
            className={classes.bodyText}
            variant="outlined"
            multiline
            value={newQuestion}
            onChange={(e) => {
              setNewQuestion(e.target.value);
            }}
          />

          <Divider />

          <Typography variant="h5" className={classes.bodyHeader}>
            Alternative Phrasings:
          </Typography>

          <Paper variant="outlined" className={classes.questionInput}>
            <Input
              disableUnderline
              fullWidth
              multiline
              placeholder={
                "Enter new alternate phrasing for original question."
              }
              value={newAlt}
              onChange={(e) => {
                if (phrasesChanged) {
                  setAltPhrases(altPhrasesCopy);
                  setPhrasesChanged(false);
                }
                if (e.target.value.trim() === "") {
                  setNewAlt("");
                } else if (e.target.value.endsWith("\n")) {
                  let temp = e.target.value.trim();
                  let tempData = [temp, ...altPhrases];
                  setAltPhrases(tempData);
                  setAltPhrasesCopy(tempData);
                  setNewAlt("");
                } else {
                  setNewAlt(e.target.value);
                }
              }}
            />
          </Paper>

          <Collapse in={altPhrases.length > 0}>
            <Paper className={classes.tableContainer} variant="outlined">
              <Table aria-label="simple table">
                <TableBody>
                  {(rowsPerPage > 0
                    ? altPhrases.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : altPhrases
                  ).map((row, index) => (
                    <TableRow key={row} className={classes.tableRow}>
                      <TableCell
                        className={classes.tableCell}
                        component="th"
                        scope="row"
                      >
                        <IconButton
                          onClick={() => {
                            let temp = [...editAltPhrase];
                            temp[page * rowsPerPage + index] = !temp[
                              page * rowsPerPage + index
                            ];
                            setEditAltPhrase(temp);
                            setAltPhrases(altPhrasesCopy);
                          }}
                        >
                          {editAltPhrase[page * rowsPerPage + index] ? (
                            <DoneIcon color="primary" />
                          ) : (
                            <EditIcon color="primary" />
                          )}
                        </IconButton>
                        <Input
                          disableUnderline
                          fullWidth
                          multiline
                          disabled={!editAltPhrase[page * rowsPerPage + index]}
                          className={classes.tableCellText}
                          id={`${page * rowsPerPage + index}`}
                          defaultValue={altPhrases[page * rowsPerPage + index]}
                          onChange={(e) => {
                            setPhrasesChanged(true);
                            let temp = [...altPhrasesCopy];
                            temp[e.target.id] = e.target.value;
                            setAltPhrasesCopy(temp);
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            let temp = altPhrases.filter(
                              (v, i) => i !== page * rowsPerPage + index
                            );
                            setAltPhrases(temp);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={2}
                      count={altPhrases.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Paper>
          </Collapse>
        </Paper>
      </Grid>

      <Grid item container>
        <Paper className={classes.bodyPaper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" className={classes.bodyHeader}>
              Answer:
            </Typography>
          </div>
          <TextField
            className={classes.bodyText}
            variant="outlined"
            multiline
            value={newAnswer}
            onChange={(e) => {
              setNewAnswer(e.target.value);
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
