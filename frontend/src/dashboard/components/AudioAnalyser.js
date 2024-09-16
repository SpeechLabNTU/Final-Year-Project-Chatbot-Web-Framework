import React, { Component } from 'react'
import AudioVisualiser from './AudioVisualizer'
import '../../recorder'
import axios from 'axios'

class AudioAnalyser extends Component {

    constructor(props){
        super(props);
        this.state = {audioData: new Uint8Array(0),recorder:{},recordInterval:0};
        this.tick = this.tick.bind(this);
    }

    componentWillUnmount(){
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    async componentDidMount(){
        await this.startAudioStream()
    }

    async startAudioStream(){
        let source
        if (!navigator.mediaDevices) {
            console.log('browser doesn\'t support')
        }
        if (navigator.mediaDevices.getUserMedia) {

            try{
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 32768;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                source = this.audioContext.createMediaStreamSource(this.props.audio);
                source.connect(this.analyser);
                this.rafId = requestAnimationFrame(this.tick);
                const recorder = new Recorder(source, { workerPath: '/recorderWorker.js' })
                this.setState({recorder})
            }catch (e) {
                console.log('The following error occured: ' + e)
            }
        }else{
            console.log('getUserMedia not supported on your browser!')
        }
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }

    start = async () => {
        try {
          if (this.props.isBusy) {
            return
          }
          this.props.reset()
        
          await axios.post(`${this.props.backendUrl}/stream/record`, {
            token: this.props.token
          })
    
          const recordInterval = setInterval(() => {
            this.state.recorder.export16kMono((blob) => {
              if (this.props.isSocketReady) {
                this.props.socket.emit('stream-input', blob)
              }
              this.state.recorder.clear()
            }, 'audio/x-raw')
          }, 250)
    
          this.setState({
            recordInterval
          })
    
          // Start recording
          this.state.recorder.record()
    
          this.props.setBusy()
        } catch (err) {
          console.log(err)
        }
      }
    
      stop = () => {
        clearInterval(this.state.recordInterval)
        // Stop recording
        if (this.state.recorder) {
          this.state.recorder.stop()
          // Push the remaining audio to the server
          this.state.recorder.export16kMono((blob) => {
            if (this.props.isSocketReady) {
              this.props.socket.emit('stream-stop', blob)
            }
            this.state.recorder.clear()
          }, 'audio/x-raw')
        } else {
          this.$emit('onError', 'Recorder undefined')
        }
      }

    render() {
        return(
            <div>
            <div className="row">
                <div className="col-md-12 mt-5">
                    <AudioVisualiser audioData={this.state.audioData} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 mt-5">
                    <button type="button" className="btn btn-primary"
                    title="Starts listening for speech, i.e. starts recording and transcribing."
                    onMouseUp={this.stop} onMouseDown={this.start}>
                        <i className="fas fa-play" />
                        Start
                    </button>
                </div>
            </div>
            </div>
        )
    }
}

export default AudioAnalyser;