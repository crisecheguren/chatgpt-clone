import { useEffect, useState } from 'react';

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState('')
  
  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle('')
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }


  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ message: value }), 
      headers: { 'Content-Type': 'application/json'}
    }

    try {
      const response = await fetch('https://crisecheguren.com/api/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    }
    catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: 'user',
            content: value
          }, {
            title: currentTitle,
            role: message.role,
            content: message.content
        }]
      ))
    }

  }, [currentTitle, message])
  
  console.log(previousChats)

  const currentChat = previousChats.filter(prevChat => prevChat.title === currentTitle)
  const uniqueTitle = Array.from(new Set (previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}

        </ul>
        <nav>
          <p>Made by Coogins</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>CooginsGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chat, index) => (
            <li key={index}>
              <p className='role'>{chat.role}</p>
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            ChatGPT Mar 23 Version. ChatGPT may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
