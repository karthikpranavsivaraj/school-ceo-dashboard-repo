import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { WebhookDispatcher } from '../services/dispatcher.service';
import { SystemEvent, WebhookEvent } from '@shared/types';

export class WebhookController {
  static async emitEvent(req: Request, res: Response) {
    const { type, payload } = req.body;

    if (!type || !payload) {
      return res.status(400).json({ error: 'Type and payload are required' });
    }

    const event: WebhookEvent = {
      id: uuidv4(),
      type: type as SystemEvent,
      payload,
      timestamp: new Date().toISOString()
    };

    // Fire and forget (Asynchronous processing)
    WebhookDispatcher.dispatch(event);

    res.status(202).json({ message: 'Event accepted', eventId: event.id });
  }

  static async subscribe(req: Request, res: Response) {
    const { eventType, targetUrl } = req.body;
    const sub = {
      id: uuidv4(),
      eventType,
      targetUrl
    };
    WebhookDispatcher.addSubscription(sub);
    res.status(201).json(sub);
  }
}
