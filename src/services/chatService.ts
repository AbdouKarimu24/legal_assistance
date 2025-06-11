import { pool, generateCharId } from '../lib/mysql';
import { DatabaseService } from './database';

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  message: string;
  sender: 'user' | 'bot';
  createdAt: Date;
  searchQuery?: string;
  lawyerSearchResults?: any[];
}

export class ChatService {
  private apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:3000/api';

  async createSession(userId: string, title: string): Promise<ChatSession> {
    try {
      const sessionId = generateCharId();

      await pool.execute(
        `INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [sessionId, userId, title]
      );

      const [sessions] = await pool.execute(
        'SELECT * FROM chat_sessions WHERE id = ?',
        [sessionId]
      );

      return (sessions as any[])[0];
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    try {
      const [sessions] = await pool.execute(
        'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC',
        [userId]
      );

      return sessions as ChatSession[];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  async addMessage(sessionId: string, userId: string, message: string, sender: 'user' | 'bot'): Promise<ChatMessage> {
    try {
      const messageId = generateCharId();

      await pool.execute(
        `INSERT INTO chat_messages (id, session_id, user_id, message, sender, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [messageId, sessionId, userId, message, sender]
      );

      // Update session timestamp
      await pool.execute(
        'UPDATE chat_sessions SET updated_at = NOW() WHERE id = ?',
        [sessionId]
      );

      const [messages] = await pool.execute(
        'SELECT * FROM chat_messages WHERE id = ?',
        [messageId]
      );

      return (messages as any[])[0];
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const [messages] = await pool.execute(
        'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
        [sessionId]
      );

      return messages as ChatMessage[];
    } catch (error) {
      console.error('Error fetching session messages:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string, userId: string): Promise<void> {
    try {
      await pool.execute(
        'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
        [sessionId, userId]
      );
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async updateSessionTitle(sessionId: string, userId: string, title: string): Promise<void> {
    try {
      await pool.execute(
        'UPDATE chat_sessions SET title = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
        [title, sessionId, userId]
      );
    } catch (error) {
      console.error('Error updating session title:', error);
      throw error;
    }
  }
  async sendMessage(message: string, sessionId?: string, userId?: string): Promise<any> {
    try {
      console.log('Sending message:', message);

      let currentSessionId = sessionId;

      // Create new session if none provided
      if (!currentSessionId && userId) {
        currentSessionId = await this.createChatSession(userId, message);
      }

      // Save user message to database
      if (currentSessionId && userId) {
        const userMessageId = generateCharId();
        await DatabaseService.createChatMessage({
          id: userMessageId,
          sessionId: currentSessionId,
          userId: userId,
          message: message,
          sender: 'user'
        });
      }

      // Check if message is a lawyer search query
      const isLawyerSearch = this.isLawyerSearchQuery(message);
      let lawyerResults = null;

      if (isLawyerSearch) {
        lawyerResults = await this.searchLawyers(message);
      }

      // Generate response
      const botResponse = this.generateMockResponse(message, lawyerResults);

      // Save bot response to database
      if (currentSessionId && userId) {
        const botMessageId = generateCharId();
        await DatabaseService.createChatMessage({
          id: botMessageId,
          sessionId: currentSessionId,
          userId: userId,
          message: botResponse,
          sender: 'bot',
          searchQuery: isLawyerSearch ? message : undefined,
          lawyerSearchResults: lawyerResults
        });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        response: botResponse,
        sessionId: currentSessionId,
        lawyerResults: lawyerResults
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async createChatSession(userId: string, firstMessage: string): Promise<string> {
    try {
      const sessionId = generateCharId();
      const title = this.generateSessionTitle(firstMessage);

      await DatabaseService.createChatSession({
        id: sessionId,
        userId: userId,
        title: title
      });

      return sessionId;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      return await DatabaseService.getChatSessions(userId);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      return await DatabaseService.getChatMessages(sessionId);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  private isLawyerSearchQuery(message: string): boolean {
    const lawyerKeywords = [
      'lawyer', 'attorney', 'legal', 'law', 'court', 'judge', 'case',
      'lawsuit', 'contract', 'criminal', 'civil', 'family law', 'divorce',
      'immigration', 'corporate', 'business law', 'property', 'estate',
      'avocat', 'juriste', 'droit', 'tribunal', 'procès', 'contrat'
    ];

    const lowerMessage = message.toLowerCase();
    return lawyerKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private async searchLawyers(query: string): Promise<any[]> {
    try {
      // Extract search terms from query
      const searchTerm = this.extractSearchTerms(query);

      // Mock lawyer search results - replace with actual database search
      const mockResults = [
        {
          id: '1',
          name: 'Maitre Jean Dupont',
          specialization: 'Corporate Law',
          rating: 4.8,
          experienceYears: 15,
          location: 'Douala'
        },
        {
          id: '2',
          name: 'Maitre Marie Ngono',
          specialization: 'Criminal Law',
          rating: 4.6,
          experienceYears: 12,
          location: 'Yaoundé'
        }
      ];

      return mockResults.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching lawyers:', error);
      return [];
    }
  }

  private extractSearchTerms(query: string): string {
    // Simple extraction - can be enhanced with NLP
    const words = query.toLowerCase().split(' ');
    const relevantWords = words.filter(word => 
      word.length > 3 && 
      !['need', 'find', 'looking', 'want', 'help', 'with'].includes(word)
    );
    return relevantWords.join(' ') || query;
  }

  private generateSessionTitle(firstMessage: string): string {
    const words = firstMessage.split(' ').slice(0, 5);
    return words.join(' ') + (firstMessage.split(' ').length > 5 ? '...' : '');
  }
  private generateMockResponse(message: string, lawyerResults?: any[]): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your legal assistant. How can I help you with your legal questions today? I can help you find lawyers, explain legal concepts, or guide you through legal processes.";
    }

    if (lowerMessage.includes('lawyer') || lowerMessage.includes('attorney') || lowerMessage.includes('avocat')) {
      let response = "I can help you find qualified lawyers in Cameroon. What type of legal matter do you need assistance with?";

      if (lawyerResults && lawyerResults.length > 0) {
        response += "\n\nBased on your query, I found these lawyers who might be able to help:\n\n";
        lawyerResults.forEach((lawyer, index) => {
          response += `${index + 1}. **${lawyer.name}** - ${lawyer.specialization}\n`;
          response += `   ⭐ ${lawyer.rating}/5 | ${lawyer.experienceYears} years experience | ${lawyer.location}\n\n`;
        });
        response += "Would you like more details about any of these lawyers or help with contacting them?";
      } else {
        response += " For example: criminal law, family law, corporate law, immigration law, etc.";
      }

      return response;
    }

    if (lowerMessage.includes('contract') || lowerMessage.includes('contrat')) {
      let response = "For contract-related matters, I recommend consulting with a corporate lawyer or business attorney. They can help with:\n\n";
      response += "• Contract drafting and review\n";
      response += "• Business agreements\n";
      response += "• Contract disputes\n";
      response += "• Commercial law matters\n\n";

      if (lawyerResults && lawyerResults.length > 0) {
        response += "Here are some lawyers who specialize in contract law:\n\n";
        lawyerResults.forEach((lawyer, index) => {
          response += `${index + 1}. **${lawyer.name}** - ${lawyer.specialization}\n`;
          response += `   ⭐ ${lawyer.rating}/5 | Contact for consultation\n\n`;
        });
      } else {
        response += "Would you like me to find contract lawyers in your area?";
      }

      return response;
    }

    if (lowerMessage.includes('divorce') || lowerMessage.includes('family') || lowerMessage.includes('mariage')) {
      let response = "Family law matters require specialized expertise. Family law attorneys can help with:\n\n";
      response += "• Divorce proceedings\n";
      response += "• Child custody and support\n";
      response += "• Alimony and spousal support\n";
      response += "• Property division\n";
      response += "• Adoption procedures\n\n";

      if (lawyerResults && lawyerResults.length > 0) {
        response += "Here are family law specialists who can assist you:\n\n";
        lawyerResults.forEach((lawyer, index) => {
          response += `${index + 1}. **${lawyer.name}** - ${lawyer.specialization}\n`;
          response += `   ⭐ ${lawyer.rating}/5 | ${lawyer.experienceYears} years experience\n\n`;
        });
      } else {
        response += "Shall I help you find family law specialists in your area?";
      }

      return response;
    }

    if (lowerMessage.includes('criminal') || lowerMessage.includes('arrest') || lowerMessage.includes('pénal')) {
      let response = "Criminal matters are serious and require immediate legal representation. A criminal defense attorney can:\n\n";
      response += "• Protect your constitutional rights\n";
      response += "• Provide proper legal defense\n";
      response += "• Handle court proceedings\n";
      response += "• Negotiate plea agreements\n";
      response += "• Represent you during investigations\n\n";

      if (lawyerResults && lawyerResults.length > 0) {
        response += "Here are experienced criminal defense lawyers:\n\n";
        lawyerResults.forEach((lawyer, index) => {
          response += `${index + 1}. **${lawyer.name}** - ${lawyer.specialization}\n`;
          response += `   ⭐ ${lawyer.rating}/5 | Available for immediate consultation\n\n`;
        });
        response += "🚨 **Important**: If you're facing criminal charges, contact a lawyer immediately.";
      } else {
        response += "Do you need me to find criminal lawyers near you? Time is often critical in criminal matters.";
      }

      return response;
    }

    if (lowerMessage.includes('immigration') || lowerMessage.includes('visa') || lowerMessage.includes('immigration')) {
      let response = "Immigration law is complex and constantly changing. An immigration attorney can help with:\n\n";
      response += "• Visa applications and renewals\n";
      response += "• Citizenship and naturalization\n";
      response += "• Deportation defense\n";
      response += "• Work permits\n";
      response += "• Family reunification\n\n";

      if (lawyerResults && lawyerResults.length > 0) {
        response += "Here are immigration law specialists:\n\n";
        lawyerResults.forEach((lawyer, index) => {
          response += `${index + 1}. **${lawyer.name}** - ${lawyer.specialization}\n`;
          response += `   ⭐ ${lawyer.rating}/5 | ${lawyer.experienceYears} years experience\n\n`;
        });
      } else {
        response += "Would you like me to locate immigration lawyers who can help with your specific situation?";
      }

      return response;
    }

    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
      return "Legal fees vary depending on the complexity of your case and the lawyer's experience. Here's what you should know:\n\n" +
             "• **Consultation**: Many lawyers offer free initial consultations\n" +
             "• **Hourly rates**: Typically range from 25,000 to 100,000 FCFA per hour\n" +
             "• **Fixed fees**: Some cases have predetermined costs\n" +
             "• **Contingency**: Some lawyers work on a percentage of settlement\n\n" +
             "I recommend discussing fees upfront with any lawyer you contact. Would you like me to find lawyers who offer free consultations?";
    }

    return "I understand you need legal assistance. Could you provide more details about your specific legal issue? This will help me:\n\n" +
           "• Give you better guidance\n" +
           "• Connect you with the right legal professional\n" +
           "• Provide relevant legal information\n\n" +
           "You can ask about specific legal areas like criminal law, family law, business law, immigration, contracts, or any other legal matter.";
  }
}