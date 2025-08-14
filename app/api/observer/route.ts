import { handleObserverAPI } from '@/lib/observer';

export async function POST(request: Request) {
  return handleObserverAPI(request);
}