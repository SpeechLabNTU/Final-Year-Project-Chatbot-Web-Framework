import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";

import Container from "@material-ui/core/Container";

import LogoHeaders from "./components/LogoHeaders";
import MassChatbotComparison from "./MassChatbotComparison";
import AudioTranscriptionComparison from "./AudioTranscriptionComparison";
import MultiChatbotInterface from "./MultiChatbotInterface";

import ReactTab from "react-bootstrap/Tab";
import ReactTabs from "react-bootstrap/Tabs";

import ChatWidget from "../chatwidget/ChatWidget";

export default function Dashboard(props) {
  const theme = useTheme();
  const backendURL = process.env.REACT_APP_API;
  const [models, setModels] = React.useState([]);

  useEffect(() => {
    axios.get(`${backendURL}/models`).then((res) => {
      setModels(res.data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeModelCall = (modelName, params) => {
    return new Promise((resolve, reject) => {
      const foundModelDetail = models.find((m) => m.name === modelName);
      const endpoint = foundModelDetail.model_endpoint.find(
        (e) => e.topic === params.topic
      );
      if (endpoint) {
        axios
          .post(`${backendURL}` + endpoint.topic_endpoint, params, {
            timeout: 2500,
          })
          .then((r) => {
            resolve(r.data.reply);
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        console.log(
          "should not reach here, a model cant be available but have no url"
        );
      }
    });
  };
  const askJamieAPI = (params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_API}/jamie/api/askJamieFast`, params)
        .then((res) => {
          resolve(res.data.reply);
        })
        .catch((error) => {
          console.log("Error contacting Ask Jamie");
        });
    });
  };
  const similarQuestionsAPI = (params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_API}/bani/api/queryEndpoint`, params)
        .then((res) => {
          resolve(res.data.similarQuestions);
        })
        .catch((error) => {
          console.log("Error contacting Bani server");
        });
    });
  };
  // for response comparisons
  const makeResponseComparisonRequest = (params) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.REACT_APP_API}/similarity/cosineSimilarity`,
          params
        )
        .then((res) => {
          let probability = res.data.reply;
          if (probability !== -1) {
            resolve(probability);
          }
        })
        .catch((error) => {
          reject("Error Contacting API server");
          console.log("Error Contacting API server");
        });
    });
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg" style={{ paddingBottom: theme.spacing(6) }}>
        <LogoHeaders />
        <ChatWidget />
        <ReactTabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">
          {/* Multi-Chatbot Interface */}
          <ReactTab eventKey="dashboard" title="Multi-Chatbot Interface">
            <MultiChatbotInterface
              backendURL={backendURL}
              models={models}
              queryModel={makeModelCall}
              similarQuestionsAPI={similarQuestionsAPI}
              makeResponseComparisonRequest={makeResponseComparisonRequest}
            />
          </ReactTab>

          {/* Performance Analysis */}
          <ReactTab eventKey="chart" title="Performance Analysis">
            <MassChatbotComparison
              models={models}
              askJamieAPI={askJamieAPI}
              queryModel={makeModelCall}
              makeResponseComparisonRequest={makeResponseComparisonRequest}
            />
          </ReactTab>

          {/* Transcription Comparison */}
          <ReactTab eventKey="audio" title="Transcription Comparison">
            <AudioTranscriptionComparison backendUrl={backendURL} />
          </ReactTab>
        </ReactTabs>
      </Container>
    </React.Fragment>
  );
}
