// ─────────────────────────────────────────────────────────────────────────────
// src/api/recordsApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import axiosInstance from './axiosInstance';
import { RECORDS_PREFIX } from '../config/api';
import type {
  CreateRecordRequest,
  RecordsResponse,
  TestRecord,
  TestType,
} from '../types';

export async function createRecord(body: CreateRecordRequest): Promise<TestRecord> {
  const { data } = await axiosInstance.post<TestRecord>(RECORDS_PREFIX, body);
  return data;
}

export async function getRecords(params?: {
  limit?: number;
  test_type?: TestType;
}): Promise<RecordsResponse> {
  const { data } = await axiosInstance.get<RecordsResponse>(RECORDS_PREFIX, {
    params: {
      limit: params?.limit ?? 20,
      ...(params?.test_type ? { test_type: params.test_type } : {}),
    },
  });
  return data;
}

export async function getRecord(recordId: string): Promise<TestRecord> {
  const { data } = await axiosInstance.get<TestRecord>(
    `${RECORDS_PREFIX}/${recordId}`,
  );
  return data;
}

export async function deleteRecord(recordId: string): Promise<void> {
  await axiosInstance.delete(`${RECORDS_PREFIX}/${recordId}`);
}
