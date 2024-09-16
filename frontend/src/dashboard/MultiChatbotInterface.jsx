import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./components/TabPanel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Collapse from "@material-ui/core/Collapse";
import TopicSelection from "./components/TopicSelection";

import Record from "../Record";
import AnswerModel from "./components/AnswerModel";

const useStyles = makeStyles((theme) => ({
  descriptionCardGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function MultiChatbotInterface(props) {
  const classes = useStyles();

  const [chatbotMenuRef, setChatbotMenuRef] = React.useState(null);

  const [input, setInput] = React.useState("");
  const [similarQuestions, setSimilarQuestions] = React.useState(null);
  const [topic, setTopic] = React.useState("Baby Bonus");
  const [inputMethod, setInputMethod] = React.useState(0);

  /**
   * Each model requires the following state information to be kept track of:
   * Example:
   * {
   *  'modelName': {
   *      score: number,
   *      loading: boolean,
   *      response: String,
   *      check: boolean,
   *      available: boolean
   *  }
   * }
   */
  const [modelDetail, setModelDetail] = React.useState({});

  React.useEffect(() => {
    setInput("");
    resetResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMethod]);

  const compareOne = async (ModelResponse, jamieResponse) => {
    let req = { responses: [ModelResponse, jamieResponse] };
    return props
      .makeResponseComparisonRequest(req)
      .then((val) => {
        try {
          return parseFloat(val);
        } catch {
          return null;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getResponses = (value) => {
    if (value.trim() === "") return;
    resetResponses();

    var params = {
      question: value,
      topic: topic,
    };

    props.similarQuestionsAPI(params).then((val) => {
      setSimilarQuestions(val);
    });

    const currentModelDetail = modelDetail;
    const queries = Object.keys(modelDetail)
      .filter((modelName) => {
        return modelDetail[modelName].check;
      })
      .map((modelName) => {
        const { check, available } = modelDetail[modelName];
        if (check && available) {
          currentModelDetail[modelName] = {
            ...currentModelDetail[modelName],
            loading: true,
          };
          setModelDetail(currentModelDetail);
          return props
            .queryModel(modelName, params)
            .then(async (r) => {
              return { modelName: modelName, response: r };
            })
            .catch((e) => {
              return { modelName: modelName, response: e };
            });
        } else {
          console.log("not checked", modelName);
          return null;
        }
      });

    Promise.all(queries).then((replies) => {
      replies.forEach((reply) => {
        if (reply && !(reply.response instanceof Error)) {
          currentModelDetail[reply.modelName] = {
            ...currentModelDetail[reply.modelName],
            loading: false,
            response: reply.response,
          };
        } else {
          console.log("Error");
          console.log(reply);
          currentModelDetail[reply.modelName] = {
            ...currentModelDetail[reply.modelName],
            loading: false,
            response: "Error getting response",
          };
        }
      });
      // setModelDetail({ ...currentModelDetail });
      replies.forEach(async (reply) => {
        if (reply.modelName === "AskJamie") return;
        const modelScore = await compareOne(
          reply.response,
          currentModelDetail["AskJamie"].response
        );
        currentModelDetail[reply.modelName].score = modelScore;
        setModelDetail({ ...currentModelDetail });
      });
      // console.log(currentModelDetail);
    });
  };

  const resetResponses = () => {
    // reset score and score
    const currentModelDetail = modelDetail;
    Object.keys(modelDetail).forEach((modelName) => {
      // eslint-disable-next-line no-unused-vars
      const details = modelDetail[modelName];
      currentModelDetail[modelName] = {
        ...currentModelDetail[modelName],
        score: null,
        response: "",
      };
      setModelDetail(currentModelDetail);
    });
  };
  const getEnabledText = () => {
    if (props.models && Object.keys(modelDetail).length > 0) {
      return Object.keys(props.models)
        .filter((index) => {
          return modelDetail[props.models[index].name].check;
        })
        .map((index) => {
          return props.models[index].name;
        })
        .join(" ");
    } else {
      return "";
    }
  };
  // To display boxes based on how many model
  const renderBoxes = () => {
    return Object.keys(modelDetail)
      .filter((name) => {
        return modelDetail[name].check;
      })
      .map((name) => {
        const details = modelDetail[name];
        return (
          <Grid item xs={12} sm={6} md={4}>
            <AnswerModel
              value={name}
              loading={details.loading}
              response={details.response}
              score={details.score}
            />
          </Grid>
        );
      });
  };
  const renderCheckboxList = () => {
    return (
      <Menu
        anchorEl={chatbotMenuRef}
        keepMounted
        open={Boolean(chatbotMenuRef)}
        onClose={() => {
          setChatbotMenuRef(null);
        }}
      >
        {Object.keys(modelDetail)
          .filter((name) => {
            return name !== "AskJamie";
          })
          .map((name) => {
            const details = modelDetail[name];
            return (
              <MenuItem
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {name}
                <Checkbox
                  checked={details.check}
                  name={"check" + name}
                  value={name}
                  onChange={(e) => {
                    setModelDetail({
                      ...modelDetail,
                      [name]: {
                        ...modelDetail[name],
                        check: e.target.checked,
                        response: !e.target.checked
                          ? ""
                          : modelDetail[name].response,
                      },
                    });
                  }}
                />
              </MenuItem>
            );
          })}
      </Menu>
    );
  };

  useEffect(() => {
    resetResponses();
    let currentModelDetail = modelDetail;
    props.models.forEach((model) => {
      // eslint-disable-next-line no-unused-vars
      const name = model.name;
      const matchedEndpoint = model.model_endpoint.find(
        (topicEndpointInfo) => topicEndpointInfo.topic === topic
      );
      if (matchedEndpoint) {
        currentModelDetail = {
          ...currentModelDetail,
          [model.name]: {
            ...currentModelDetail[model.name],
            available: true,
            check: true,
          },
        };
      } else {
        currentModelDetail = {
          ...currentModelDetail,
          [model.name]: {
            ...currentModelDetail[model.name],
            available: false,
            check: false,
          },
        };
      }
    });
    setModelDetail(currentModelDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    const newModelDetail = {};
    Object.keys(props.models).forEach((index) => {
      const model = props.models[index];
      newModelDetail[model.name] = {
        score: null,
        loading: false,
        response: "",
        check: true,
        available: true,
      };
    });
    setModelDetail(newModelDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.models]);

  return (
    <React.Fragment>
      <Grid container className={classes.descriptionCardGrid} justify="center">
        <Card style={{ paddingRight: 10 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Multi Chatbot Interface for Response Comparisons
            </Typography>
            <Typography variant="body2">
              1. Choose between Text or Realtime Speech Input
              <br />
              2. Selection of Question Topic and Chatbot Services
              <br />
              3. Real-time Speech allows choice of Google or AISG Transcription
              Services
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* The rest of the main interface */}
      <Grid container spacing={3}>
        {/* Tabs and User Inputs */}
        <Grid item container xs={12}>
          <Grid item>
            <Paper>
              <Tabs
                orientation="vertical"
                variant="fullWidth"
                value={inputMethod}
                onChange={(e, newValue) => {
                  setInputMethod(newValue);
                }}
              >
                <Tab label="Text" />
                <Tab label="Speech" />
              </Tabs>
            </Paper>
          </Grid>

          <Grid item style={{ flexGrow: 1, maxWidth: 700 }}>
            {/* User Input (Text or Speech) */}
            <Paper>
              {/* Text input */}
              <TabPanel value={inputMethod} index={0}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Input
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">FAQ</InputAdornment>
                    }
                    labelWidth={60}
                    multiline
                    name="input"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                  <Button
                    onClick={() => {
                      getResponses(input);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </FormControl>
              </TabPanel>
              {/* Speech to text */}
              <TabPanel value={inputMethod} index={1}>
                <Record
                  input={input}
                  setInput={setInput}
                  backendURL={props.backendURL}
                  resetResponses={resetResponses}
                  getResponses={getResponses}
                />
                <br />
                <Typography variant="h6">Transcription: {input}</Typography>
              </TabPanel>
            </Paper>

            {/* Suggested Questions drop down menu */}
            <Collapse in={similarQuestions !== null}>
              <Paper style={{ marginTop: 3 }}>
                <List dense>
                  <ListItem>
                    <Typography variant="h6">
                      You might be interested:{" "}
                    </Typography>
                  </ListItem>
                  {similarQuestions &&
                    similarQuestions.map((item) => {
                      if (item !== input)
                        return (
                          <ListItem
                            button
                            onClick={(e) => {
                              setInput(e.target.innerText);
                              getResponses(e.target.innerText);
                            }}
                          >
                            {item}
                          </ListItem>
                        );
                      else return null;
                    })}
                </List>
              </Paper>
            </Collapse>
          </Grid>
        </Grid>
        {/* Question topic and Chatbot services */}
        <Grid item container xs={12} spacing={1}>
          <Grid item>
            <TopicSelection topic={topic} setTopic={setTopic} />
          </Grid>
          <Grid item>
            <Paper elevation={1}>
              <List component="nav">
                <ListItem
                  button
                  onClick={(event) => {
                    setChatbotMenuRef(event.currentTarget);
                  }}
                >
                  <ListItemText
                    primary="Chatbot Services"
                    secondary={getEnabledText()}
                  />
                </ListItem>
              </List>
            </Paper>
            {renderCheckboxList()}
          </Grid>
        </Grid>
        {/* below are the various chatbots */}
        {renderBoxes()}
      </Grid>
    </React.Fragment>
  );
}
