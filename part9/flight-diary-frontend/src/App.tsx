import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import { getAllDiaries } from "../src/services/diaryService"
import Diary from "./components/Diary";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  return (
    <div>
      <Diary entries={diaries} />
    </div>
  );
};


export default App
