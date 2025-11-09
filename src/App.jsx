import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import robot from './assets/images/robot.png'
import user from './assets/images/user.png'
import Chatbot from './botReponses'
import loadingGif from './assets/images/loading-spinner.gif';



function ChatInput({messageData, setChatMessages}) {
  const [inputMessages, setInputMessages] = useState("");
  
  function getChatInputText(event) {
    setInputMessages(event.target.value)
  }

  

  async function sendMessage() {
    const newChatMessages = [
      ...messageData,
      {
        message: inputMessages,
        sender: "user",
        id: crypto.randomUUID()
      }
    ]
    setChatMessages(newChatMessages);

    setChatMessages([
      ...newChatMessages,
      // This creates a temporary Loading... message.
      // Because we don't save this message in newChatMessages,
      // it will be remove later, when we add the response.
      {
        message: <img src={loadingGif} alt="loading..." className="loading-gif" />,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    const response = await Chatbot.getResponseAsync(inputMessages);
    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID()
      }
    ])

    
  }
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    } else if (event.key === 'Escape') {
      setInputText('');
    }
  }

  return (
    <div className='input-container'>
      <input 
        placeholder="Ask anything!"
        size='30'
        onChange={getChatInputText}
        onKeyDown={handleKeyDown}
        value={inputMessages}
        className= "input-bar"
      />
      <button onClick={sendMessage} className='send-btn'>Send</button>
    </div>
  )
}

function ChatMessages({messageData}) {
  const chatMessagesRef = useRef(null);
  useEffect(() => {
    const messagesElem = chatMessagesRef.current;
    if(messagesElem) {
      messagesElem.scrollTop = messagesElem.scrollHeight;
    }
  },[messageData]);
  return (
    <div className='messages-container' ref = {chatMessagesRef}>
      {messageData.map((data) => {
        return(
          <ChatMessage message = {data.message} sender = {data.sender} key = {data.id}></ChatMessage>
        )
      })}
    </div>
  )
}



function ChatMessage(props) {
  let message = props.message;
  let sender = props.sender;
  return (
    <div className= {sender == 'user' ? 'user-message' : 'robot-message'}>
      {sender === "robot" && <img src={robot} className='profile-img'/>}
      <div className='message-text'>{message}</div>
      {sender === "user" && <img src={user} className='profile-img' />}
    </div>
  )
}
function App() {

  const [messageData, setChatMessages] = useState(
  [])
  return (
    <div className='app-container'>
      <ChatMessages messageData={messageData}></ChatMessages>
      <ChatInput messageData={messageData} setChatMessages={setChatMessages}></ChatInput>
    </div>
  );
}

export default App;