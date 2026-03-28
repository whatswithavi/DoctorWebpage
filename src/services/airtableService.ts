import { AirtableResponse, TriageRecord, TriageStatus } from '../types';

const BASE_ID = 'appJnU6QKo8GstVpM';
const TABLE_NAME = 'Triage_Logs';
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;

const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

export const fetchTriageLogs = async (): Promise<TriageRecord[]> => {
  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data: AirtableResponse = await response.json();
    return data.records;
  } catch (error) {
    console.error('Error fetching triage logs:', error);
    throw error;
  }
};

export const updateTriageRecord = async (
  recordId: string,
  fields: Partial<TriageRecord['fields']>
): Promise<TriageRecord> => {
  try {
    const response = await fetch(`${AIRTABLE_URL}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating triage record:', error);
    throw error;
  }
};
