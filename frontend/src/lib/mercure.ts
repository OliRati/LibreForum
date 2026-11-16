import type { Post } from "../api/posts";

export type TopicUpdate = {
  type: "post_created";
  post: Post;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTopicUpdate(value: unknown): value is TopicUpdate {
  if (!isRecord(value) || value.type !== "post_created" || !isRecord(value.post)) {
    return false;
  }

  const post = value.post;
  return (
    typeof post.id === "number" &&
    typeof post.content === "string" &&
    typeof post.createdAt === "string" &&
    isRecord(post.author) &&
    typeof post.author.id === "number" &&
    typeof post.author.username === "string"
  );
}

export function subscribeToTopic(topicId: number, onMessage: (data: TopicUpdate) => void) {
  const url = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL || "http://localhost:3000/.well-known/mercure");
  url.searchParams.append("match", `topic/${topicId}`);

  const eventSource = new EventSource(url.toString());

  eventSource.onmessage = (event) => {
    let data: unknown;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      console.error("Invalid JSON received from Mercure", error);
      return;
    }

    if (!isTopicUpdate(data)) {
      console.error("Invalid topic update received from Mercure", data);
      return;
    }

    onMessage(data);
  };

  return () => eventSource.close();
}
