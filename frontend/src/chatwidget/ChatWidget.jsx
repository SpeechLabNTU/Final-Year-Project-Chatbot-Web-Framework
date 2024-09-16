import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import {
  Widget,
  addResponseMessage,
  renderCustomComponent,
  addUserMessage
} from 'react-chat-widget'
import axios from 'axios'

import 'react-chat-widget/lib/styles.css';
import './style.css'

const useStyles = makeStyles(theme => ({
  response: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    backgroundColor: '#f4f7f9',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'left'
  },
  text: {
    margin: '0px',
  },
  textLink: {
    textAlign: 'left',
    margin: '0px',
    padding: '0px',
    border: 'none',
    backgroundColor: '#f4f7f9',
    color: 'blue',
    '&:hover': {
      textDecoration: 'underline',
      color: 'darkblue'
    }
  },
  timestamp: {
    fontSize: '10px',
    marginTop: '5px',
  }
}))

export default function ChatWidget(props) {

  const classes = useStyles()

  React.useEffect(() => {
    addResponseMessage("Hello! What can I help you with today?")
  }, [])

  const baniAPI = params => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/bani/api/queryEndpoint`, params)
        .then((res) => {
          resolve([res.data.code, res.data.reply, res.data.similarQuestions])
        })
        .catch(error => {
          console.log("Error contacting Bani server")
        })
    })
  }

  const getTime = () => {
    const now = new Date()

    return `${now.getHours()}:${now.getMinutes()}`
  }

  const myResponseComponent = (props) => {

    const onQuestionClick = question => {
      addUserMessage(question)
      handleNewUserMessage(question)
    }

    const text = props.text
    const questions = props.questions
    const timestamp = (typeof props.timestamp === 'undefined' ? true : props.timestamp)

    return (
      <div className={classes.response}>
        <div className={classes.message}>
          <p className={classes.text}>{text}</p>
          {questions && questions.map(qns => (
            <button
              className={classes.textLink}
              onClick={(event) => {
                event.preventDefault()
                onQuestionClick(qns)
                return false
              }}
            >
              {qns}<br></br>
            </button>

          ))}
        </div>
        { timestamp &&
          (<div className={classes.timestamp}>
            <span>{getTime()}</span>
          </div>)
        }
      </div >
    )
  }

  const handleNewUserMessage = async message => {
    var params = {
      question: message,
    }
    const [code, reply, similarQuestions] = await baniAPI(params)

    switch (code) {
      case 0:
        // success
        renderCustomComponent(myResponseComponent, {
          text: reply,
          timestamp: false,
        })
        renderCustomComponent(myResponseComponent, {
          text: "Related questions:",
          questions: similarQuestions
        })
        break
      case 1:
        // out of question set
        renderCustomComponent(myResponseComponent, {
          text: "I'm sorry, your question does not provide enough detail for me to answer. Please rephrase your question.",
          timestamp: false
        })
        renderCustomComponent(myResponseComponent, {
          text: "You might be interested:",
          questions: similarQuestions,
        })
        break
      case 2:
        // ambiguous
        renderCustomComponent(myResponseComponent, {
          text: "I'm sorry, your question does not provide enough detail for me to answer. Please rephrase your question.",
          timestamp: false
        })
        renderCustomComponent(myResponseComponent, {
          text: "Did you mean?",
          questions: similarQuestions,
        })
        break
      default:
        break
    }
  }

  return (
    <React.Fragment>
      <Widget
        title="Bani Bot"
        subtitle=""
        handleNewUserMessage={handleNewUserMessage}
      />
    </ React.Fragment>
  )
}