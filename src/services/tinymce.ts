import { Editor } from '@tinymce/tinymce-react';
import { openAIService } from './openai';

class TinyMCEService {
  private editor: Editor | null = null;

  setEditor(editor: Editor) {
    this.editor = editor;
  }

  getEditor(): Editor | null {
    return this.editor;
  }

  async improveWriting(content: string): Promise<string> {
    try {
      const prompt = `Improve the following text while maintaining its core meaning. Make it clearer, more concise, and more engaging:

      ${content}

      Return only the improved text without any additional commentary.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are a professional editor. Improve the text while maintaining its original meaning and intent.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const improvedContent = await openAIService.generateChatCompletion(messages);
      return improvedContent;
    } catch (error) {
      console.error('Error improving writing:', error);
      throw error;
    }
  }

  async suggestCompletion(content: string): Promise<string> {
    try {
      const prompt = `Complete the following text in a natural way:

      ${content}

      Return only the suggested completion without any additional commentary.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are a writing assistant. Suggest natural completions that match the style and context of the text.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const completion = await openAIService.generateChatCompletion(messages);
      return completion;
    } catch (error) {
      console.error('Error suggesting completion:', error);
      throw error;
    }
  }

  async fixGrammar(content: string): Promise<string> {
    try {
      const prompt = `Fix any grammar, spelling, or punctuation errors in the following text:

      ${content}

      Return only the corrected text without any additional commentary.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are a grammar expert. Fix any errors while maintaining the original meaning and style.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const correctedContent = await openAIService.generateChatCompletion(messages);
      return correctedContent;
    } catch (error) {
      console.error('Error fixing grammar:', error);
      throw error;
    }
  }

  async generateOutline(content: string): Promise<string> {
    try {
      const prompt = `Create a detailed outline for the following text:

      ${content}

      Return the outline in a structured format using markdown.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are an expert in content organization. Create clear, logical outlines that capture the main points and structure.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const outline = await openAIService.generateChatCompletion(messages);
      return outline;
    } catch (error) {
      console.error('Error generating outline:', error);
      throw error;
    }
  }

  async summarize(content: string): Promise<string> {
    try {
      const prompt = `Summarize the following text while maintaining all key points:

      ${content}

      Return a concise summary in a clear, readable format.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are a summarization expert. Create clear, concise summaries that capture all important information.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const summary = await openAIService.generateChatCompletion(messages);
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async explainConcept(content: string): Promise<string> {
    try {
      const prompt = `Explain the following concept in a clear, easy-to-understand way:

      ${content}

      Include examples and analogies where appropriate.`;

      const messages = [
        {
          role: 'system' as const,
          content: 'You are an expert teacher. Explain concepts clearly using simple language, examples, and analogies.',
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const explanation = await openAIService.generateChatCompletion(messages);
      return explanation;
    } catch (error) {
      console.error('Error explaining concept:', error);
      throw error;
    }
  }
}

export const tinymceService = new TinyMCEService();
