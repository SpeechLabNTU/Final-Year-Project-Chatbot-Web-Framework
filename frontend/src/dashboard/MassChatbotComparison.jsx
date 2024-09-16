import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import IconButton from "@material-ui/core/IconButton";
import DirectionsIcon from "@material-ui/icons/Directions";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Charts from "./components/Charts";
import TopicSelection from "./components/TopicSelection";
import TablePaginationActions from "../components/TablePaginationActions";

const useStyles = makeStyles((theme) => ({
  descriptionCardGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  userMenuGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  modeSelect: {
    minWidth: 120,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
  },
}));

export default function MassChatbotComparison(props) {
  const classes = useStyles();

  let [fileName, setFilename] = React.useState("");
  const [value, setValue] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [graph, setGraph] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [scoreArray, setScoreArray] = React.useState([]);
  const [completed, setCompleted] = React.useState(0);
  const [text, setText] = React.useState([]);
  const [submit, setSubmit] = React.useState(false);

  const [upload, setUpload] = React.useState(false);
  const [option, setOption] = React.useState(false);

  const [topic, setTopic] = React.useState("Baby Bonus");

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  let tablecontent = [];
  let scorecontent = [];

  const [modelDetail, setModelDetail] = React.useState({});

  useEffect(() => {
    const newModelDetail = {};
    Object.keys(props.models).forEach((index) => {
      if (props.models[index].name !== "AskJamie") {
        const model = props.models[index];
        newModelDetail[model.name] = {
          available: true,
        };
      }
    });
    setModelDetail(newModelDetail);
  }, [props.models]);

  // when topic changes
  React.useEffect(() => {
    let clear = clearContent();
    clear.then((val) => {
      if (val === "Ok") {
        setPage(0);
      }
    });
    let currentModelDetail = modelDetail;
    props.models.forEach((model) => {
      const name = model.name;
      const matchedEndpoint = model.model_endpoint.find(
        (topicEndpointInfo) => topicEndpointInfo.topic === topic
      );
      if (matchedEndpoint && name !== "AskJamie") {
        currentModelDetail = {
          ...currentModelDetail,
          [model.name]: {
            ...currentModelDetail[model.name],
            available: true,
          },
        };
      } else {
        currentModelDetail = {
          ...currentModelDetail,
          [model.name]: {
            ...currentModelDetail[model.name],
            available: false,
          },
        };
      }
    });
    setModelDetail(currentModelDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  //---------------------------Generate Report Pop Up Handler-------------------------------
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //---------------------------Page Change Handler-----------------------------------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //----------------Promise to clear state and array of Chart and Table Array---------------
  function clearContent() {
    return new Promise(function (resolve, reject) {
      try {
        //Clear Array content for state re-population
        tablecontent = [];
        scorecontent = [];

        //Clear Chart and Table State
        setScoreArray([]);
        setRows([]);

        //Disable Chart
        setGraph(false);

        resolve("Ok");
      } catch (e) {
        reject(e);
      }
    });
  }

  function handleAnalysis() {
    let clear = clearContent();
    clear
      .then((val) => {
        if (val === "Ok") {
          setLoad(true);
          setSubmit(true);
          setPage(0);
        } else {
          console.log(val);
        }
      })
      .then(() => {
        handleSingleInput(text, 0, text.length);
      });
  }

  //--------------------------Chatbot Service Change Handler--------------------------------
  const handleChange = (event) => {
    setValue(event.target.value);
    setOption(true);

    //Clear Chart and Table State
    setScoreArray([]);
    setRows([]);
    setGraph(false);
    setPage(0);
  };

  //------------------------------Response Summarizer---------------------------------------
  function summarizer(result) {
    var array = [];
    var summary = "";
    array = result.split(" ");
    if (array.length < 40) {
      summary = result;
    } else {
      for (var i = 0; i < 40; i++) {
        if (i === 39) {
          summary += array[i] + "...";
        } else {
          summary += array[i] + " ";
        }
      }
    }

    return summary;
  }

  //----------------------Recursive function to return results one at a time--------------------
  async function handleSingleInput(textArray, i, textArrayLength) {
    if (i === textArrayLength) {
      setText(textArray);
      setScoreArray(scorecontent);
      setGraph(true);
      setLoad(false);
      setCompleted(0);
      setSubmit(false);
      return;
    } else {
      let query = textArray[i];
      let params = {
        question: query,
        topic: topic,
      };
      let service = "";
      const modelName = value;

      service = props.queryModel(modelName, params);

      await Promise.all([props.askJamieAPI(params), service])
        .then((val) => {
          let req = { responses: [summarizer(val[0]), summarizer(val[1])] };
          let prob = props.makeResponseComparisonRequest(req);
          prob.then((probval) => {
            scorecontent.push(probval);
            tablecontent = [
              ...tablecontent,
              createData(
                query,
                summarizer(val[0]),
                summarizer(val[1]),
                probval
              ),
            ];
            setRows(tablecontent);
          });
        })
        .then(() => {
          i = i + 1;
          handleSingleInput(textArray, i, textArrayLength);
          setCompleted((i / (textArrayLength - 1)) * 100);
        });
    }
  }

  //----------------------Read file contents for computing response comparison----------------------
  const handleFileRead = (e) => {
    const content = e.target.result;
    let textArray = content.split("\n");
    setText(textArray);
  };

  //---------------------------On file upload, call handleFileRead to load content------------------
  function onChangehandler(e) {
    //Load file content
    try {
      let file = e.target.files[0];
      fileName = file.name;
      setFilename(fileName);
      let fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
      setUpload(true);

      //Clear Chart and Table State
      setScoreArray([]);
      setRows([]);
      setGraph(false);
    } catch (e) {
      setFilename("No file detected, please upload a line seperated text file");
      setUpload(false);
    }
  }

  //----------------------------Creates data contents for table listing------------------------------
  function createData(input, jamie, dialogflow, score) {
    return { input, jamie, dialogflow, score };
  }

  return (
    <React.Fragment>
      {/* File Upload Form */}
      <Grid container className={classes.descriptionCardGrid} justify="center">
        <Card style={{ paddingRight: 10 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Performance Analysis of Chatbot Service
            </Typography>
            <Typography variant="body2">
              1. Upload Text File of Line-Seperated Queries
              <br />
              2. Selection of Chatbot Service for Analysis
              <br />
              3. Click on Start Analysis
              <br />
              4. View Table Listing of Responses and Accuracy Score
              <br />
              5. Graphical Report available after all responses are processed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        container
        className={classes.userMenuGrid}
        spacing={2}
        direction="column"
      >
        <Grid item container spacing={4} alignItems="center">
          {/* File uploading field */}
          <Grid item style={{ flexGrow: 1, display: "flex", maxWidth: 400 }}>
            <FormControl component="fieldset" style={{ flex: 1 }}>
              <Paper component="form" className={classes.root}>
                <InputBase
                  className={classes.input}
                  placeholder={fileName === "" ? "No Files Uploaded" : fileName}
                  inputProps={{ "aria-label": "Accuracy Plot" }}
                  disabled
                />

                <Divider className={classes.divider} orientation="vertical" />

                {load === true ? (
                  <IconButton
                    disabled
                    component="label"
                    color="primary"
                    className={classes.iconButton}
                    aria-label="directions"
                  >
                    <input
                      type="file"
                      id="myFile"
                      name="filename"
                      style={{ display: "none" }}
                      onChange={onChangehandler}
                    />
                    <DirectionsIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    component="label"
                    color="primary"
                    className={classes.iconButton}
                    aria-label="directions"
                  >
                    <input
                      type="file"
                      id="myFile"
                      name="filename"
                      style={{ display: "none" }}
                      onChange={onChangehandler}
                    />
                    <DirectionsIcon />
                  </IconButton>
                )}
              </Paper>
            </FormControl>
          </Grid>

          <Grid item>
            {/* Chatbot Selection Field */}
            <FormControl className={classes.modeSelect}>
              <Select
                disabled={!upload || load}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                onChange={handleChange}
              >
                {Object.keys(modelDetail)
                  .filter((name) => {
                    return modelDetail[name].available;
                  })
                  .map((name) => {
                    // eslint-disable-next-line no-unused-vars
                    const details = modelDetail[name];
                    return <MenuItem value={name}>{name}</MenuItem>;
                  })}
              </Select>

              <FormHelperText>Chat Model Selection</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item>
            {/* Start Upload Button */}
            <FormControl className={classes.modeSelect}>
              {upload === true && option === true && submit === false ? (
                <Button
                  onClick={handleAnalysis}
                  variant="contained"
                  color="primary"
                >
                  Start Analysis
                </Button>
              ) : (
                <Button disabled variant="contained" color="primary">
                  Start Analysis
                </Button>
              )}
            </FormControl>
          </Grid>

          <Grid item>
            {/* Graph Generation Button */}
            <FormControl className={classes.modeSelect}>
              {graph === false ? (
                <Button disabled variant="contained" color="primary">
                  Generate Graph
                </Button>
              ) : (
                <Button
                  onClick={handleClickOpen}
                  variant="contained"
                  color="primary"
                >
                  Generate Graph
                </Button>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Question Topic Selection */}
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <TopicSelection topic={topic} setTopic={setTopic} />
          </Grid>
        </Grid>
      </Grid>

      {load === true && (
        <LinearProgress
          variant="determinate"
          value={completed}
          style={{ marginBottom: "5px", width: "100%" }}
        />
      )}

      {/* Table for response display and page management */}
      <Grid container>
        <FormControl className={classes.tableContainer}>
          <Paper variant="outlined">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Input</TableCell>
                  <TableCell>Ask Jamie Response</TableCell>
                  {value === "" ? (
                    <TableCell>Chatbot Response</TableCell>
                  ) : (
                    <TableCell>{value} Response</TableCell>
                  )}
                  <TableCell align="right">Similarity Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow key={row.input}>
                    <TableCell component="th" scope="row">
                      {row.input}
                    </TableCell>
                    <TableCell>{row.jamie}</TableCell>
                    <TableCell>{row.dialogflow}</TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
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
                    colSpan={4}
                    count={rows.length}
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
        </FormControl>
      </Grid>

      {/* Popup dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Performance Analysis of ${value}`}</DialogTitle>
        <DialogContent style={{ minWidth: 600 }}>
          <Charts responseScoreArray={scoreArray} chatbot={value} />
          {/* <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous location data to
          Google, even when no apps are running.
        </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
