import axios from 'axios';
import { WebhookEvent, WebhookSubscription } from '@shared/types';

export class WebhookDispatcher {
  private static subscriptions: WebhookSubscription[] = [
    {
      id: 'sub1',
      eventType: 'MARKS_UPLOADED' as any,
      targetUrl: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3004/events'
    }
  ];

  static async dispatch(event: WebhookEvent) {
    const targets = this.subscriptions.filter(sub => sub.eventType === event.type);
    
    console.log(`[Webhook Service] Dispatching event ${event.type} to ${targets.length} targets`);

    for (const target of targets) {
      this.sendWithRetry(target.targetUrl, event);
    }
  }

  private static async sendWithRetry(url: string, event: WebhookEvent, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await axios.post(url, event);
        console.log(`[Webhook Service] Successfully sent event ${event.id} to ${url}`);
        return;
      } catch (error: any) {
        console.warn(`[Webhook Service] Attempt ${i + 1} failed for ${url}: ${error.message}`);
        if (i === retries - 1) {
          console.error(`[Webhook Service] Max retries reached for event ${event.id} to ${url}`);
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  static addSubscription(sub: WebhookSubscription) {
    this.subscriptions.push(sub);
  }
}
