import { AirtableResponse, TriageRecord, TriageStatus } from '../types';

const getAirtableUrl = () => {
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
  return `https://api.airtable.com/v0/${baseId}/${tableName}`;
};

const getApiKey = () => import.meta.env.VITE_AIRTABLE_API_KEY;

export const fetchTriageLogs = async (): Promise<TriageRecord[]> => {
  try {
    const url = getAirtableUrl();
    const apiKey = getApiKey();
    
    console.log('📡 Fetching from Airtable:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Airtable Error Details:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data: AirtableResponse = await response.json();
    console.log('✅ Sync Successful:', data.records.length, 'records found.');
    return data.records;
  } catch (error) {
    console.error('🛑 Critical Sync Failure:', error);
    throw error;
  }
};

export const updateTriageRecord = async (
  recordId: string,
  fields: Partial<TriageRecord['fields']>
): Promise<TriageRecord> => {
  try {
    const url = `${getAirtableUrl()}/${recordId}`;
    const apiKey = getApiKey();
    
    console.log('🔄 Updating Case:', recordId, 'via', url);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      console.error('❌ Update Error:', response.status, response.statusText);
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    console.log('✅ Update Saved Successfully.');
    return await response.json();
  } catch (error) {
    console.error('🛑 Critical Update Failure:', error);
    throw error;
  }
};
