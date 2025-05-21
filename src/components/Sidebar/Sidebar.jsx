import './Sidebar.css'

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat">+ New Chat</button>
      </div>
      <div className="chat-history">
        <div className="history-item">Previous Chat 1</div>
        <div className="history-item">Previous Chat 2</div>
      </div>
    </aside>
  )
}