export function subscribeToTopic(topicId: number, onMessage: (data: any) => void) {
    const url = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL || 'http://localhost:3000/.well-known/mercure');
    url.searchParams.append('topic', `topic/${topicId}`);

    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    return () => eventSource.close();
}
