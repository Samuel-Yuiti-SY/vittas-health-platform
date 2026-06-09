function ChatBubble({ children, from = 'vitti' }) {
  const isVitti = from === 'vitti';
  return (
    <div className={`flex ${isVitti ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
          isVitti ? 'bg-white text-vittas-text ring-1 ring-slate-100' : 'bg-vittas-blue text-white'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default ChatBubble;
