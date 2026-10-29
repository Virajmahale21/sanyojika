import { Request, Response } from 'express';
import { AiAssistantService } from '../services/aiAssistantService';

export const askAiAssistant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, language } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'A regulatory or navigational query string is required.' });
      return;
    }

    const preferredLang = language || req.user?.preferredLang || 'en';
    const response = await AiAssistantService.queryAssistant(query, preferredLang);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process AI assistant query.' });
  }
};
