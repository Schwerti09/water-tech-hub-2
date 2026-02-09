import { useState, useRef, useEffect } from "react";
import { Bot, Mic, Send, X, Volume2, Loader2, Sparkles } from "lucide-react";
import { useVoiceStream, useVoiceRecorder } from "../../replit_integrations/audio"; // Correct path for integration
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HydroAssistent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio integration
  const [currentTranscript, setCurrentTranscript] = useState("");
  const recorder = useVoiceRecorder();
  const stream = useVoiceStream({
    onUserTranscript: (text) => {
      setMessages(prev => [...prev, { role: 'user', content: text }]);
    },
    onTranscript: (_, full) => setCurrentTranscript(full),
    onComplete: (full) => {
      setMessages(prev => [...prev, { role: 'assistant', content: full }]);
      setCurrentTranscript("");
    },
    onError: (err) => {
      console.error("Voice Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble processing that." }]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTranscript]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // For text-only (using voice API endpoint but manual text handling would be better if separate routes existed)
    // Since we are using the audio integration, let's just simulate the text flow visually for now
    // In a real app, we'd have a text-only endpoint or adapt the audio one.
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    
    // Simulate response for demo purposes if not using voice
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I analyze water quality data. Currently, I'm best experienced with voice interaction! Try the microphone button." 
      }]);
    }, 1000);
  };

  const handleMicClick = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stopRecording();
      // Using a dummy conversation ID 1 for now
      await stream.streamVoiceResponse(`/api/conversations/1/messages`, blob);
    } else {
      await recorder.startRecording();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-40
          bg-gradient-to-br from-primary to-secondary text-white
          flex items-center justify-center
          ${isOpen ? 'hidden' : 'flex'}
        `}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-100px)] z-50 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">HydroBot</h3>
                  <p className="text-xs text-muted-foreground">AI Water Expert</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center mt-10 space-y-3 opacity-60">
                  <Bot className="w-12 h-12 mx-auto text-primary/50" />
                  <p className="text-sm">Ask me about water quality in your area or filter recommendations!</p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-white text-foreground border border-border rounded-bl-none'}
                  `}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {currentTranscript && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed bg-white border border-border rounded-bl-none shadow-sm flex items-center gap-2">
                     <span className="animate-pulse">●</span> {currentTranscript}
                   </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/50 border-t border-border backdrop-blur-sm">
              <div className="relative flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type or speak..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm shadow-inner"
                />
                
                <div className="absolute right-2 flex items-center gap-1">
                  {input ? (
                     <Button 
                       size="icon" 
                       variant="ghost" 
                       className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
                       onClick={handleSend}
                     >
                       <Send className="w-4 h-4" />
                     </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant={recorder.state === "recording" ? "destructive" : "ghost"}
                      className={`h-8 w-8 rounded-lg transition-all ${recorder.state === "recording" ? "animate-pulse" : "text-muted-foreground hover:text-primary"}`}
                      onClick={handleMicClick}
                    >
                      {recorder.state === "recording" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
