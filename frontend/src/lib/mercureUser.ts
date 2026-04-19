export function subscribeToUser(userId: number, onMessage: (data: any) => void) {
    const url = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL || 'http://localhost:3000/.well-known/mercure');
    url.searchParams.append('topic', `user/${userId}`);

    const es = new EventSource(url.toString());

    es.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    return () => es.close();
}
