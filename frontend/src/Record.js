import React from 'react'
import './recorder'
import axios from 'axios'
import io from 'socket.io-client'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

export default function Record(props) {

  const [socket, setSocket] = React.useState(null)
  const [browserSupported, setBrowserSupported] = React.useState(true)
  const [audioRecorder, setAudioRecorder] = React.useState(null)

  const [recordInterval, setRecordInterval] = React.useState(null)
  const [recordTimeout, setRecordTimeout] = React.useState(null)

  const [isRecording, setIsRecording] = React.useState(false)
  const [service, setService] = React.useState("")

  const [transcriptionAISG, setTranscriptionAISG] = React.useState("")
  const [transcriptionGoogle, setTranscriptionGoogle] = React.useState("")
  const [partialResultAISG, setPartialResultAISG] = React.useState("")
  const [partialResultGoogle, setPartialResultGoogle] = React.useState("")
  const [isStreamOpenAISG, setIsStreamOpenAISG] = React.useState(false)
  const [isStreamOpenGoogle, setIsStreamOpenGoogle] = React.useState(false)

  React.useEffect( () => {
    var clientSocket
    var audioCtx
    var mediaStream
    var audioRec

    // initialize socket to backend for voice
    const initSockets = () => {
      clientSocket = io(props.backendURL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        // reconnectionAttempts: Infinity
        reconnectionAttempts: 2
      })
      clientSocket.on('connect', () => {
        console.log("Socket connected!")
        setSocket(clientSocket)
      })

      clientSocket.on("stream-ready-aisg", () => {
        setIsStreamOpenAISG(true)
      })

      clientSocket.on("stream-ready-google", () => {
        setIsStreamOpenGoogle(true)
      })

      clientSocket.on("stream-data-google", data => {
        if (data.results[0].isFinal) {
          setPartialResultGoogle("")
          setTranscriptionGoogle( prev => (prev + data.results[0].alternatives[0].transcript) )
        }
        else {
          setPartialResultGoogle( "[..." + data.results[0].alternatives[0].transcript + "]" )
        }
      })

      clientSocket.on("stream-data-aisg", data => {
        if (data.result.final) {
          setPartialResultAISG("")
          setTranscriptionAISG( prev => (prev.slice(0,-1) + ' ' + data.result.hypotheses[0].transcript) )
        }
        else {
          setPartialResultAISG( "[..." + data.result.hypotheses[0].transcript + "]" )
        }
      })

      clientSocket.on("stream-close-aisg", () => {
        setIsStreamOpenAISG(false)
      })

      clientSocket.on("stream-close-google", () => {
        setIsStreamOpenGoogle(false)
      })
    }

    // initialize recorder for voice
    const initializeRecorder = async () => {

      if (!navigator.mediaDevices) {
        console.log("Browser does not support navigator.mediaDevices")
        setBrowserSupported(false)
        setTranscriptionAISG("Media input not supported.")
        setTranscriptionGoogle("Media input not supported.")
      }
      else if (navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.")
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()

        const constraints = { audio: true }
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

          let source = audioCtx.createMediaStreamSource(mediaStream)
          window.source = source

          // eslint-disable-next-line no-undef
          audioRec = new Recorder(source, {workerPath: '/recorderWorker.js'})
          setAudioRecorder(audioRec)
        }
        catch (e) {
          console.log(e)
          setBrowserSupported(false)
          setTranscriptionAISG("Media input not possible.")
          setTranscriptionGoogle("Media input not possible.")
        }
      }
      else {
        console.log("getUserMedia not supported on this browser.")
      }
    }

    initSockets()
    initializeRecorder()

    return ( () => {
      if (clientSocket) {
        clientSocket.emit("stream-cancel")
        clientSocket.disconnect()
      }
      if (mediaStream) {
        let track = mediaStream.getTracks()[0]
        track.stop()
        audioCtx.close()
      }
      audioRec.stop()
      audioRec.clear()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const startRecording = async () => {

    resetSpeechInputs()

    await axios.post(`${props.backendURL}/stream/google`, {
      socketid: socket.id,
    })
    await axios.post(`${props.backendURL}/stream/aisg`, {
      socketid: socket.id,
    })

    setIsRecording(true)
    audioRecorder.record()

    setService("")

    setRecordInterval( setInterval( () => {
      audioRecorder.export16kMono( blob => {
        if (socket) {
          socket.emit("stream-input", blob)
        }
        audioRecorder.clear()
      }, "audio/x-raw")
    }, 250))

    setRecordTimeout( setTimeout( () => {
      if (isRecording) {
        stopRecording()
        setTimeout(() => {
          setPartialResultAISG("Stopped: 2 minute maximum stream duration reached.")
          setPartialResultGoogle("Stopped: 2 minute maximum stream duration reached.")
        }, 1000)
        // delay in set text to allow buffer for last message from backend
      }
    }, 120000))
    // 2 min maximum as google api will raise error if streaming for too long
  }

  const stopRecording = () => {

    setIsRecording(false)
    clearInterval(recordInterval)
    setRecordInterval(null)
    clearTimeout(recordTimeout)
    setRecordTimeout(null)

    audioRecorder.stop()
    audioRecorder.export16kMono( blob => {
      if (socket) {
        socket.emit('stream-stop', blob)
      }
      audioRecorder.clear()
    }, 'audio/x-raw')
  }

  const sendTranscription = () => {
    if (service === "aisg"){
      props.setInput(transcriptionAISG)
      props.getResponses(transcriptionAISG)
    }
    else if (service === "google"){
      props.setInput(transcriptionGoogle)
      props.getResponses(transcriptionGoogle)
    }
  }

  const resetSpeechInputs = () => {
    setPartialResultAISG("")
    setPartialResultGoogle("")
    setTranscriptionAISG("")
    setTranscriptionGoogle("")
  }

  return (
    <Grid item container spacing={2} direction='column'>

      <Grid item>
        <FormControl fullWidth variant="outlined">
        <TextField
        id="aisgResults"
        label="AISG Speech Labs"
        value={transcriptionAISG ? transcriptionAISG + ' ' + partialResultAISG : ""}
        InputProps={{readOnly: true}}
        InputLabelProps={{shrink: true}}
        variant="filled"
        multiline
        placeholder={isRecording && !isStreamOpenAISG ? "Not connected." : ""}
        />

        <TextField
        id="googleResults"
        label="Google Cloud Speech-to-Text (Enhanced Model)"
        value={transcriptionGoogle ? transcriptionGoogle + ' ' + partialResultGoogle : ""}
        InputProps={{readOnly: true}}
        InputLabelProps={{shrink: true}}
        variant="filled"
        multiline
        placeholder={isRecording && !isStreamOpenGoogle ? "Not connected." : ""}
        />

        {isRecording &&
          <LinearProgress color="secondary" />}

        <ButtonGroup variant="contained">
          <Button
          style={{width:'50%'}}
          color="primary"
          onClick={startRecording}
          disabled={!browserSupported || isRecording}
          >Start
          </Button>
          <Button
          style={{width:'50%'}}
          color="secondary"
          onClick={stopRecording}
          disabled={!browserSupported || !isRecording}
          >Stop
          </Button>
        </ButtonGroup>
        </FormControl>
      </Grid>


      <Grid item>
      <Typography variant="h5">
        Select transcription to use:
      </Typography>
      <RadioGroup row aria-label="speechService" name="speechService"
      value={service}
      onChange={(e)=>{
        setService(e.target.value)
      }} >
        <FormControlLabel
        disabled={isRecording}
        value="aisg"
        label="AISG"
        control={<Radio color="primary" />}
        />
        <FormControlLabel
        disabled={isRecording}
        value="google"
        label="Google Premium"
        control={<Radio color="primary" />}
        />
      </RadioGroup>
      <Button onClick={sendTranscription}
      variant="contained" color="primary" disabled={service==="" || isRecording}>
      Submit
      </Button>
      </Grid>


    </Grid>
  )
}
