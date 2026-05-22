import type { Request, Response } from 'express';
import documentService from '../services/documentService';

class DocumentController {
  async getTypes(req: Request, res: Response) {
    try {
      const data = await documentService.listDocuments();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tipos de documento' });
    }
  }
}

export default new DocumentController();