import { apiFetch } from '../lib/api.js';
import type { Report } from '../types/report.js';

export type PaginatedReports = {
  items: Report[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

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

export async function getReport(reportId: number): Promise<Report> {
  return apiFetch<Report>(`/api/reports/${reportId}`);
}

export async function getReports(page?: number, limit?: number): Promise<PaginatedReports> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  const queryString = params.toString();
  const url = queryString ? `/api/reports?${queryString}` : '/api/reports';
  return apiFetch<PaginatedReports>(url);
}

export async function getMyReports(): Promise<Report[]> {
  return apiFetch<Report[]>('/api/reports/mine');
}