import { config } from '../config/config';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

class OpenAIService {
  private apiKey: string;
  private headers: HeadersInit;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  private async makeRequest(endpoint: string, body: any) {
    const response = await fetch(`${config.apiEndpoints.openai}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  }

  async generateChatCompletion(messages: ChatMessage[], options: CompletionOptions = {}) {
    const data = await this.makeRequest('/chat/completions', {
      model: options.model || config.models.chat,
      messages,
      max_tokens: options.maxTokens || config.maxTokens,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
    });

    if (!data?.choices?.[0]?.message) {
      throw new Error('Invalid response from OpenAI');
    }

    return data.choices[0].message.content;
  }

  async generateStudyPlan(topic: string, duration: string) {
    const prompt = `Create a detailed study plan for learning ${topic} over ${duration}.
    Return the response in this exact JSON format:
    {
      "overview": "string (brief overview of the study plan)",
      "objectives": ["string (learning objective)"],
      "schedule": [
        {
          "week": "string (e.g., 'Week 1')",
          "topics": ["string (topic to cover)"],
          "activities": ["string (learning activity)"],
          "resources": ["string (recommended resource)"]
        }
      ],
      "milestones": ["string (key milestone to achieve)"],
      "assessmentMethods": ["string (way to assess progress)"]
    }`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a study planning expert. Return ONLY a valid JSON object with the exact structure requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const content = await this.generateChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log('Raw study plan content:', content);

      // Try to find a JSON object in the content
      let jsonContent = content;
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        jsonContent = match[0];
      }

      console.log('Study plan JSON to parse:', jsonContent);

      // Parse the JSON
      const plan = JSON.parse(jsonContent.trim());

      // Validate the structure
      if (!plan.overview || !Array.isArray(plan.objectives) || !Array.isArray(plan.schedule)) {
        throw new Error('Invalid study plan structure');
      }

      return plan;
    } catch (error) {
      console.error('Error in generateStudyPlan:', error);
      throw error;
    }
  }

  async generateQuiz(topic: string, difficulty: string = 'medium', count: number = 5) {
    const prompt = `Generate a quiz about ${topic} with ${count} multiple choice questions at ${difficulty} difficulty level.
    Return the response in this exact JSON format:
    [
      {
        "question": "string (the question)",
        "options": ["string (option 1)", "string (option 2)", "string (option 3)", "string (option 4)"],
        "correctAnswer": "string (the correct option)",
        "explanation": "string (explanation of the correct answer)"
      }
    ]`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a quiz generation expert. Return ONLY a valid JSON array with the exact structure requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const content = await this.generateChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log('Raw quiz content:', content);

      // Try to find a JSON array in the content
      let jsonContent = content;
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        jsonContent = match[0];
      }

      console.log('Quiz JSON to parse:', jsonContent);

      // Parse the JSON
      const quiz = JSON.parse(jsonContent.trim());

      // Validate the structure
      if (!Array.isArray(quiz)) {
        throw new Error('Quiz response is not an array');
      }

      // Validate each question
      quiz.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || !q.correctAnswer || !q.explanation) {
          console.error('Invalid question:', q);
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
      });

      return quiz;
    } catch (error) {
      console.error('Error in generateQuiz:', error);
      throw error;
    }
  }

  async generatePracticeProblems(topic: string, difficulty: string = 'medium') {
    const prompt = `Generate 5 practice problems about ${topic} at ${difficulty} difficulty level.
    Return the response in this exact JSON format:
    [
      {
        "problem": "string (the problem statement)",
        "hints": ["string (helpful hint)"],
        "solution": "string (detailed solution)",
        "difficulty": "string (easy/medium/hard)"
      }
    ]`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a practice problem generation expert. Return ONLY a valid JSON array with the exact structure requested.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const content = await this.generateChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log('Raw practice problems content:', content);

      // Try to find a JSON array in the content
      let jsonContent = content;
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        jsonContent = match[0];
      }

      console.log('Practice problems JSON to parse:', jsonContent);

      // Parse the JSON
      const problems = JSON.parse(jsonContent.trim());

      // Validate the structure
      if (!Array.isArray(problems)) {
        throw new Error('Practice problems response is not an array');
      }

      // Validate each problem
      problems.forEach((p, index) => {
        if (!p.problem || !Array.isArray(p.hints) || !p.solution || !p.difficulty) {
          console.error('Invalid problem:', p);
          throw new Error(`Problem ${index + 1} is missing required fields`);
        }
      });

      return problems;
    } catch (error) {
      console.error('Error in generatePracticeProblems:', error);
      throw error;
    }
  }

  async explainConcept(concept: string, level: string = 'intermediate') {
    const prompt = `Explain the following concept in detail:
    
    Concept: ${concept}
    Level: ${level}
    
    Include:
    1. Clear definition
    2. Key principles
    3. Real-world examples
    4. Common misconceptions
    5. Related concepts
    6. Practice problems or applications`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert tutor skilled at explaining complex concepts in an accessible way. Use analogies and examples to make ideas clear.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1500,
    });
  }

  async generateGlossaryTerms(topic: string, count: number = 10) {
    const prompt = `Generate ${count} glossary terms for ${topic}.
    
    For each term, you must provide:
    1. Term name (a key concept or phrase)
    2. A clear, concise definition
    3. A practical example of usage
    4. 2-3 related terms
    5. A specific category within ${topic}

    Return the response in this exact JSON format:
    [
      {
        "term": "string (the term or concept)",
        "definition": "string (clear explanation)",
        "example": "string (practical usage example)",
        "relatedTerms": ["string", "string"],
        "category": "string (specific category)"
      }
    ]`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a glossary generation expert. Return ONLY a valid JSON array with the exact structure requested. Each term MUST have a definition.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const content = await this.generateChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000,
      });

      console.log('Raw content from OpenAI:', content);

      // Try to find a JSON array in the content
      let jsonContent = content;
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        jsonContent = match[0];
      }

      console.log('JSON content to parse:', jsonContent);

      // Parse the JSON
      const terms = JSON.parse(jsonContent.trim());
      
      // Validate the structure
      if (!Array.isArray(terms)) {
        throw new Error('Response is not an array');
      }
      
      // Validate and transform each term
      const validatedTerms = terms.map(term => {
        if (!term?.term || !term?.definition) {
          console.error('Invalid term:', term);
          throw new Error(`Term or definition missing: ${JSON.stringify(term)}`);
        }
        
        return {
          term: String(term.term).trim(),
          definition: String(term.definition).trim(),
          example: String(term.example || '').trim(),
          relatedTerms: Array.isArray(term.relatedTerms) 
            ? term.relatedTerms.map(t => String(t).trim())
            : [],
          category: String(term.category || topic).trim(),
        };
      });

      console.log('Validated terms:', validatedTerms);
      return validatedTerms;
    } catch (error) {
      console.error('Error in generateGlossaryTerms:', error);
      throw error;
    }
  }

  async generateTaskBreakdown(task: string) {
    const prompt = `Break down the following task into manageable steps:
    
    Task: ${task}
    
    Include:
    1. Sequential steps
    2. Estimated time for each step
    3. Prerequisites
    4. Required resources
    5. Success criteria
    6. Common challenges
    7. Tips for completion`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert in task analysis and planning. Break down complex tasks into clear, actionable steps.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1000,
    });
  }

  async generateGoalSuggestions(goal: {
    title: string;
    description: string;
    category: string;
  }) {
    const prompt = `Analyze this goal and provide specific suggestions:
    
    Goal Title: ${goal.title}
    Description: ${goal.description}
    Category: ${goal.category}
    
    Provide:
    1. 3-5 specific milestones
    2. Success metrics
    3. Potential challenges
    4. Resources needed
    5. Timeline recommendations
    6. Progress tracking methods`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert goal-setting coach. Provide actionable, specific suggestions that are realistic and measurable.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.8,
      maxTokens: 1000,
    });
  }

  async generateMnemonics(concept: string, count: number = 3) {
    const prompt = `Create ${count} memorable mnemonics or memory aids for learning:
    
    Concept: ${concept}
    
    For each mnemonic:
    1. The memory aid
    2. Explanation of how it works
    3. Why it's effective
    4. Example usage`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert in creating memorable learning aids. Create mnemonics that are catchy, relevant, and easy to remember.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.9,
      maxTokens: 1000,
    });
  }

  async generateStudyNotes(topic: string, format: 'outline' | 'mindmap' | 'summary' = 'outline') {
    const prompt = `Create comprehensive study notes for:
    
    Topic: ${topic}
    Format: ${format}
    
    Include:
    1. Main concepts
    2. Key definitions
    3. Important relationships
    4. Examples
    5. Common applications
    6. Review questions
    
    Format the notes in a clear, structured way using markdown.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert note-taker and educator. Create clear, organized notes that facilitate learning and retention.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 2000,
    });
  }

  async reviewAnswer(topic: string, studentAnswer: string, questionContext: string) {
    const prompt = `Review the following student answer:
    
    Topic: ${topic}
    Question Context: ${questionContext}
    Student Answer: ${studentAnswer}
    
    Provide:
    1. Overall assessment
    2. Specific strengths
    3. Areas for improvement
    4. Correct concepts
    5. Misconceptions identified
    6. Suggested improvements
    7. Additional resources or practice recommendations`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert tutor providing constructive feedback. Be encouraging while identifying areas for improvement.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1000,
    });
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
