import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { ChatContainer } from './components/ChatContainer/ChatContainer'
import { Footer } from './components/Footer/Footer'
import { ChatProvider } from './context/ChatContext'
import './App.css'

function App() {
  return (
    <ChatProvider>
      <div className="app-layout">
        <Header />
        <div className="main-container">
          <Sidebar />
          <main className="main-content">
            <ChatContainer />
          </main>
        </div>
        <Footer />
      </div>
    </ChatProvider>
  )
}

export default App
