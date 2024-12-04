// src/utils/RequestQueue.ts

type RequestHandler = () => Promise<void>;

class RequestQueue {
  private queue: RequestHandler[] = [];
  private isProcessing = false;

  enqueue(requestHandler: RequestHandler): void {
    this.queue.push(requestHandler);
    this.processQueue().catch((error) => {
      console.error('Error processing queue:', error);
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const requestHandler = this.queue.shift();
      if (requestHandler) {
        try {
          await requestHandler();
        } catch (error) {
          console.error('Error processing request:', error);
        }
      }
    }

    this.isProcessing = false;
  }
}

const requestQueue = new RequestQueue();
export default requestQueue;
