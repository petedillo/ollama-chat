import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { ChatContainer } from './components/ChatContainer/ChatContainer'
import { Footer } from './components/Footer/Footer'
import './App.css'

function App() {
  return (
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
  )
}

export default App
