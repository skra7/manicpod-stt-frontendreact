import React, { Component } from 'react';
import { CopyBlock, dracula } from "react-code-blocks";
import './Recording.css';
// import Bird from "./sounds/birds.mp3"
const audioType = 'audio/*';




var myInterval;

export default class RecordingApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
          recording: false,
          audios: [],
          language : "jsx",
          languageDemo : ["To send data \n socket.emit('startGoogleCloudStream',blob); \n fileType : audio/mp3","To fetch data \n socket.on('transcription',(data) => {console.log(data)}"],
          responses : '',
          lineNumbers : false
        };
      }

     
    
      async componentDidMount() {
        const stream = await navigator.mediaDevices.getUserMedia({audio : true });
        // show it to user
        // this.audio.src = window.URL.createObjectURL(stream);
        // this.audio.play();
        // init recording
       
        this.mediaRecorder = new MediaRecorder(stream);
        // init data storage for video chunks
        this.chunks = [];
        // listen for data from media recorder
        this.mediaRecorder.ondataavailable = e => {
            // console.log("Event data is",e.data);
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data);
            
          }
        };
        
      }

      //  componentWillUnmount(){
      //   this.mediaRecorder.stop();
      // }

     
    
      startRecording(e) {
        e.preventDefault();
        // wipe old data chunks
        this.chunks = [];
        // start recorder with 10ms buffer
        // this.mediaRecorder.start(100);
        this.mediaRecorder.start(100);
       myInterval =  setInterval(() => {
          console.log("Chunk data is",this.chunks);
          const blob = new Blob(this.chunks.splice(0,this.chunks.length), { 'type' : 'audio/mp3' });
          // setTimeout(()=>this.mediaRecorder.stop(),3000);
          console.log("My chunk is",blob);
          this.props.socket.emit('startGoogleCloudStream',blob);
          this.props.socket.on('transcription',(data) => {
            this.setState({responses : this.state.responses+data})
            
          });

          

          
          // this.setState({chunks : []});
          
        },3000)
        // say that we're recording
        this.setState({recording: true});
        // this.setState({chunks : []});
      }
    
      stopRecording(e) {
        e.preventDefault();
        
        // stop the recorder
        this.mediaRecorder.stop();
        clearInterval(myInterval);
        // say that we're not recording
        this.setState({recording: false});
        // save the video to memory
        this.saveAudio();
      }
    
      saveAudio() {
        // convert saved chunks to blob
        const blob = new Blob(this.chunks, { 'type' : 'audio/wav; codecs=opus' });
        // generate video url from blob
        const audioURL = window.URL.createObjectURL(blob);
        // append videoURL to list of saved videos for rendering
        const audios = this.state.audios.concat([audioURL]);
        this.setState({audios});
      }
    
      deleteAudio(audioURL) {
        // filter out current videoURL from the list of saved videos
        const audios = this.state.audios.filter(a => a !== audioURL);
        this.setState({audios});
      }
    
      render() {
        const {recording, audios,responses,language,languageDemo,lineNumbers} = this.state;

        //  console.log("AUdio file is",audios);
    
        return (
          <div className="camera">
            <div className="demo">
              {
                languageDemo.map(d => (
                  
                  <CopyBlock
          language={language}
          text={d}
          showLineNumbers={lineNumbers}
          theme={dracula}
          wrapLines={true}
          codeBlock
        />
        
        
                ))
              }
            
            </div>
           
            <div>
              {!recording && <button style={{margin : "30px","background" : "grey",padding : "10px 60px", fontSize : "20px",borderRadius : "5px"}} onClick={e => this.startRecording(e)}>Record</button>}
              {recording && <button onClick={e => this.stopRecording(e)}>Stop</button>}
            </div>
            <div style={{margin : "30px", fontSize : "20px"}}>
              <h1>Response are</h1>
              <p>{responses}</p>
            </div>
            
          </div>
        );
      }
}
