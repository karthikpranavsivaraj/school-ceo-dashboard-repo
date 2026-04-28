import { Request, Response } from 'express';
import { KPIService } from '../services/kpi.service';

export class EventController {
  static async handleWebhook(req: Request, res: Response) {
    const event = req.body;
    
    console.log(`[Analytics Service] Received event: ${event.type} (${event.id})`);
    KPIService.processEvent(event);

    res.status(200).json({ message: 'Event processed by Analytics' });
  }

  static async getKPIs(req: Request, res: Response) {
    res.json(KPIService.getKPIs());
  }

  static async getTrends(req: Request, res: Response) {
    res.json(KPIService.getAttendanceTrend());
  }
}
