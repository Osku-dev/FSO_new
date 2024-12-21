import patientData from '../../data/patientData';
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';


const getEntries = (): PatientEntry[] => {
  return patientData ;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getEntry = (id: string): PatientEntry => {
  return findPatientById(id);
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patientData.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = ( patientId: string, entry: NewEntry ): Entry => {

  const patient = findPatientById(patientId);

  const newEntry = {
    id: uuid(),
    ...entry
  };

   patient.entries.push(newEntry);
  return newEntry;
};

const findPatientById = (id: string): PatientEntry => {
  const patient = patientData.find(patient => patient.id === id);
  if (!patient) {
    throw new Error(`Patient with ID ${id} not found`);
  }
  return patient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  getEntry, addEntry
};