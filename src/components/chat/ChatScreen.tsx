import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  lawyerResults?: any[];
}

const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your legal assistant. I can help you with questions about Cameroon law, including family law, criminal law, property law, and business law. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = new ChatService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Create initial session when component mounts
    if (user && !currentSessionId) {
      createNewSession();
    }
  }, [user]);

  const createNewSession = async () => {
    if (!user) return;

    try {
      const session = await chatService.createSession(user.id, 'New Chat Session');
      setCurrentSessionId(session.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        inputMessage, 
        currentSessionId, 
        user?.id
      );

      let botResponseText = response.response;

      // If lawyer results are returned, format them nicely
      if (response.lawyerResults && response.lawyerResults.length > 0) {
        // The response already includes formatted lawyer results
        // Just use it as is
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        lawyerResults: response.lawyerResults
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentSessionId(response.sessionId);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again. Make sure you are logged in to save your chat history.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLegalResponse = (message: string): string => {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi')) {
      return "Hello! I'm your Cameroon legal assistant. How can I help you with legal information today?";
    } else if (normalizedMessage.includes('theft') || normalizedMessage.includes('stealing')) {
      return "**Theft in Cameroon Law**\n\nTheft is addressed in Section 318 of the Cameroon Penal Code.\n\n**Definition:** Theft is defined as fraudulently taking property belonging to another person.\n\n**Penalties:**\n- Simple theft: Imprisonment from 5 to 10 years and a fine\n- Aggravated theft (with weapons or at night): Imprisonment from 10 to 20 years\n\nIf you're dealing with a theft case, it's advisable to consult with a licensed attorney in Cameroon for specific advice.";
    } else if (normalizedMessage.includes('marriage') || normalizedMessage.includes('divorce')) {
      return "**Marriage and Divorce in Cameroon**\n\nCameroon recognizes both civil marriages and traditional marriages.\n\n**Marriage Requirements:**\n- Minimum age: 18 for males, 15 for females (with parental consent)\n- No existing marriages (prohibition of polygamy in civil marriages)\n- Consent of both parties\n\n**Divorce:**\n- Grounds include adultery, abandonment, and cruelty\n- Both judicial and traditional divorce procedures exist\n- Child custody typically favors the mother for young children\n\nThe Civil Status Registration Ordinance (No. 81-02) governs civil marriages and divorces in Cameroon.";
    } else if (normalizedMessage.includes('assault') || normalizedMessage.includes('battery') || normalizedMessage.includes('fight')) {
      return "**Assault in Cameroon Law**\n\nAssault is covered under Section 337 of the Cameroon Penal Code.\n\n**Definition:** Assault refers to any force intentionally applied to another person without their consent.\n\n**Penalties:**\n- Simple assault: Imprisonment from 6 days to 3 years and a fine\n- Aggravated assault (causing serious harm): Imprisonment from 5 to 10 years\n- Assault resulting in death unintentionally: Imprisonment from 6 to 20 years\n\nSelf-defense is recognized as a legal justification under certain circumstances, outlined in Section 84 of the Penal Code.";
    } else {
      return "Thank you for your question about Cameroon's legal system. To provide you with accurate information, I would need to research specific Cameroon laws and regulations related to this topic. In a full implementation, I would connect to comprehensive legal databases and resources specific to Cameroon's legal code.\n\nIf you have questions about a specific area of law, such as criminal law, family law, property rights, or business regulations, please let me know and I can provide more targeted information.";
    }
  };
  return (


        Legal Assistant
        Ask questions about Cameroon's legal system, laws, and offences. I'll provide information and references to relevant legal provisions.



        {messages.map((message) => (


              {message.sender === 'user' ?  : }



                {message.text}

              {message.timestamp.toLocaleTimeString()}


        ))}

        {isLoading && (












        )}







            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a legal question..."

            disabled={isLoading}
          />






  );
};

export default ChatScreen;