import diagnosisData from '../../data/diagnosisData';
import { Diagnosis } from '../types';


const getEntries = (): Diagnosis[] => {
  return diagnosisData ;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getEntries,
  addDiagnosis
};