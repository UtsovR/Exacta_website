import { debugSupabaseLog, getSupabaseErrorDetails, supabase } from '../lib/supabaseClient';

export type Enquiry = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  service: string | null;
};

export type EnquiryInsertPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service?: string | null;
};

type EnquiryRecord = {
  id?: unknown;
  created_at?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  service?: unknown;
  need?: unknown;
};

let enquiryServiceColumn: 'service' | 'need' | null = null;

function normalizeString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeEnquiryRow(record: EnquiryRecord): Enquiry {
  return {
    id: String(record.id ?? ''),
    created_at: typeof record.created_at === 'string' ? record.created_at : '',
    name: normalizeString(record.name),
    email: normalizeString(record.email),
    phone: normalizeString(record.phone),
    company: normalizeString(record.company),
    service: normalizeString(record.service) ?? normalizeString(record.need)
  };
}

function isMissingColumnError(error: unknown) {
  const { code, message } = getSupabaseErrorDetails(error);
  const normalizedMessage = message.toLowerCase();

  return (
    code === 'PGRST204' ||
    normalizedMessage.includes('schema cache') ||
    (normalizedMessage.includes('column') && normalizedMessage.includes('does not exist'))
  );
}

function setResolvedServiceColumn(records: EnquiryRecord[]) {
  const firstRecordWithServiceColumn = records.find(
    (record) => record && typeof record === 'object' && ('service' in record || 'need' in record)
  );

  if (!firstRecordWithServiceColumn) return;

  if ('service' in firstRecordWithServiceColumn) {
    enquiryServiceColumn = 'service';
    return;
  }

  if ('need' in firstRecordWithServiceColumn) {
    enquiryServiceColumn = 'need';
  }
}

export function normalizeEnquiryInsertPayload(payload: EnquiryInsertPayload) {
  const name = normalizeString(payload.name);
  const email = normalizeString(payload.email);
  const phone = normalizeString(payload.phone);

  if (!name) {
    throw new Error('Name is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  if (!phone) {
    throw new Error('Phone is required.');
  }

  return {
    name,
    email,
    phone,
    company: normalizeString(payload.company),
    service: normalizeString(payload.service)
  };
}

export async function createEnquiry(payload: EnquiryInsertPayload) {
  const normalizedPayload = normalizeEnquiryInsertPayload(payload);
  const { service, ...basePayload } = normalizedPayload;
  const candidateColumns = service ? (enquiryServiceColumn ? [enquiryServiceColumn] : ['service', 'need']) : [null];

  let latestError: unknown = null;

  for (const candidateColumn of candidateColumns) {
    const payloadForInsert =
      candidateColumn && service ? { ...basePayload, [candidateColumn]: service } : basePayload;

    debugSupabaseLog('Enquiry submit payload', {
      table: 'enquiries',
      serviceColumn: candidateColumn,
      payload: payloadForInsert
    });

    const { error } = await supabase.from('enquiries').insert(payloadForInsert);

    debugSupabaseLog('Enquiry submit result', {
      table: 'enquiries',
      serviceColumn: candidateColumn,
      inserted: error ? null : payloadForInsert,
      error
    });

    if (!error) {
      if (candidateColumn) {
        enquiryServiceColumn = candidateColumn;
      }

      return {
        ...basePayload,
        service
      };
    }

    latestError = error;

    if (!candidateColumn || !isMissingColumnError(error)) {
      throw error;
    }
  }

  throw latestError instanceof Error ? latestError : new Error('The enquiries service column could not be resolved.');
}

export async function listEnquiriesForAdmin() {
  const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });

  debugSupabaseLog('Enquiry admin fetch result', {
    table: 'enquiries',
    count: Array.isArray(data) ? data.length : 0,
    error
  });

  const records = Array.isArray(data) ? (data as EnquiryRecord[]) : [];
  setResolvedServiceColumn(records);

  return { data: records.map((row) => normalizeEnquiryRow((row ?? {}) as EnquiryRecord)), error };
}
