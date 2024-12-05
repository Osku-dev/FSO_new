import patientData from '../../data/patientData';
import { PatientEntry, NonSensitivePatientEntry } from '../types';


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

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient
};