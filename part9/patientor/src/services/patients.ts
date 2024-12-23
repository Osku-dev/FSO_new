import axios from "axios";
import { Diagnosis, Entry, NewEntry, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

export const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis[]>(
    `${apiBaseUrl}/diagnoses`
  );

  return data;
};

export const getPatient = async (id: string) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export const createEntry = async (object: NewEntry, id: string) => {
  try {
    const { data } = await axios.post<Entry>(
      `${apiBaseUrl}/patients/${id}/entries`,
      object
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      const zodErrors = error.response.data.error.map(
        (issue: { message: string }) => issue.message
      );
      throw new Error(`Validation errors: ${zodErrors.join(", ")}`);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export default {
  getAll, create,
};

