import React, { useEffect, useState } from 'react'
import './ChatWindow.css'

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState('')
  const [messageArray, setMessageArray] = useState([])
  const [translatedText, setTranslatedText] = useState('')
  const [idxToTranslate, setIdxToTranslate] = useState('')
  const [translateLang, setTranslateLang] = useState('')

  const apiUrl = process.env.REACT_APP_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage !== '') {
      setNewMessage('')
      setMessageArray((oldArray) => [...oldArray, newMessage])

      const result = await postData(apiUrl, {
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

  const handleTranslateChange = async (val) => {
    console.log(val)
    
    setTranslateLang(val);
  }

  const handleTranslate = async (text, index) => {
    setIdxToTranslate(index)
    setTranslatedText('Translating...')
    const toTranslate = `translate to ${translateLang} ${text}`

    const translated = await postData(apiUrl, {
      prompt: toTranslate,
    })
    setTranslatedText(translated.message)
  }

  return (
    <div className="chatwindow-container">
      <h1>Ollie's Language Chatbot</h1>
      <p>Type in any language to chat with the AI bot.</p>
      <p>DO NOT enter any personal details!</p>
      <div className='translate-select'>
        <h6>Translate language:</h6>
        <select onChange={(e) => handleTranslateChange(e.target.value)}>
          <option value="english">English</option>
          <option value="german">German</option>
          <option value="spanish">Spanish</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="chatform">
        <div className="message-container">
          {messageArray.map((message, idx) => {
            return (
              <div className="message" key={idx}>
                <p
                  className={
                    idx % 2 ? 'message-bubble-bot' : 'message-bubble-human'
                  }
                  key={idx}
                >
                  {message}
                </p>
                {idxToTranslate !== idx && (
                  <div className={idx % 2 ? 'bot-span' : 'human-span'}>
                    {' '}
                    <span onClick={() => handleTranslate(message, idx)}>
                      Translate
                    </span>{' '}
                  </div>
                )}

                {idxToTranslate === idx && (
                  <span className={idx % 2 ? 'bot-span' : 'human-span'}>
                    {translatedText}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <div className="message-controls-container">
        <div className="message-controls">
          <input
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Enter a message"
            className="message-input"
            value={newMessage}
          />
          <button
            id="message-button"
            className="btn-submit"
            onClick={(e) => handleSubmit(e)}
            type="submit"
          >
            Send
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow
