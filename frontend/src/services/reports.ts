import { apiFetch } from '../lib/api.js';
import type { Report } from '../types/report.js';

export async function createReport(payload: {
  topicId?: number;
  postId?: number;
  reason: string;
}) {
  return apiFetch('/api/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getReports(): Promise<Report[]> {
  return apiFetch<Report[]>('/api/reports');
}

export async function getMyReports(): Promise<Report[]> {
  return apiFetch<Report[]>('/api/reports/mine');
}