export type TriageStatus = 'CRITICAL' | 'URGENT' | 'ROUTINE' | 'Under Review' | 'Escalated' | 'Closed';

export interface TriageRecord {
  id: string;
  fields: {
    Patient_ID: string;
    Patient_Name: string;
    Status: TriageStatus;
    Symptoms_Summary?: string;
    AI_Analysis?: string;
    AI_Status_Suggestion?: string;
    AI_Symptoms_Category?: string;
    AI_Priority_Score?: number;
    Notes?: string;
    is_rpa_processed?: boolean;
  };
  createdTime: string;
}

export interface AirtableResponse {
  records: TriageRecord[];
}
