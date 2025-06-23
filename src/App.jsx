import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar'
import { ChatContainer } from './components/ChatContainer/ChatContainer'
import { ChatProvider } from './context/ChatContext'
import './App.css'

function App() {
  return (
    <ChatProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-container">
          <Header />
          <main className="main-content">
            <ChatContainer />
          </main>
        </div>
      </div>
    </ChatProvider>
  )
}

export default App
