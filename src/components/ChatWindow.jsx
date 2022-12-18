import React, { useEffect, useState } from 'react'
import './ChatWindow.css'

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState('')
  const [messageArray, setMessageArray] = useState([])

  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl)
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage !== '') {
        setNewMessage('')
      setMessageArray((oldArray) => [...oldArray, newMessage])

      const result = await postData(apiUrl , {
        prompt: newMessage,
      })

      if (result.message) {
        setMessageArray((oldArray) => [...oldArray, result.message])
       
      }
    }
  }
  const handleMessageChange = (messageText) => {
    setNewMessage(messageText)
  }

  const postData = async (url = apiUrl, data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
    return response.json()
  }

  console.log(messageArray)

  return (
    <div className="chatwindow-container">
      <h1>Ollie's Language Chatbot</h1>
      <p>Type in any language to chat with the AI bot.</p>
      <p>DO NOT enter any personal details!</p>
      <form onSubmit={handleSubmit} className="chatform">
        <div className="message-container">
          {messageArray.map((message, idx) => {
            return <p key={idx}>{message}</p>
          })}
        </div>
       
        <div className="message-controls">
          <input
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Enter a message"
            className="message-input"
            value={newMessage}
          />
          <button
          id='message-button'
            className="btn-submit"
            onClick={(e) => handleSubmit(e)}
            type="submit"
          >
            Send
          </button>
        </div>
       </form>
    </div>
  )
}

export default ChatWindow
