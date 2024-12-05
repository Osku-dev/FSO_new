import diagnosisData from '../../data/diagnosisData';
import { DiagnosisEntry } from '../types';


const getEntries = (): DiagnosisEntry[] => {
  return diagnosisData ;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getEntries,
  addDiagnosis
};