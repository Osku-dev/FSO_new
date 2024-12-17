// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Params {
  id: string;
}

export interface DiagnosisEntry {
    code: string;
    name: string;
    latin?: string;
  }
  export interface PatientEntry {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[]
  }
  export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
  }
  export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn' | 'entries'>;
  export type NewPatientEntry = Omit<PatientEntry, 'id'>;
  
  