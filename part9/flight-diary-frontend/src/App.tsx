import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import { getAllDiaries } from "../src/services/diaryService";
import Diary from "./components/Diary";
import DiaryForm from "./components/DiaryForm";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const addDiary = (newDiary: DiaryEntry) => {
    setDiaries([...diaries, newDiary]); 
  };

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <div>
      <DiaryForm addDiary={addDiary} />
      <Diary entries={diaries} />
    </div>
  );
};

export default App;
