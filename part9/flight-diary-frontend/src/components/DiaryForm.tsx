import { useState } from 'react';
import { NewDiaryEntry, Weather, Visibility, DiaryEntry } from '../types';
import { createDiary } from "../services/diaryService";

interface DiaryFormProps {
  addDiary: (newDiary: DiaryEntry) => void;
}

const DiaryForm = ({ addDiary }: DiaryFormProps) => {
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<Weather>('sunny' as Weather);
  const [visibility, setVisibility] = useState<Visibility>('great' as Visibility);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newDiaryEntry: NewDiaryEntry = { date, weather, visibility, comment };

    try {
      const createdDiary = await createDiary(newDiaryEntry); 
      addDiary(createdDiary); 
      setDate('');
      setWeather('sunny' as Weather);
      setVisibility('great' as Visibility);
      setComment('');
    } catch (error) {
      console.error('Failed to create diary entry:', error);
    }
  };

  return (
    <div>
      <h1>New Diary Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Weather</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value as Weather)}
            required
          >
            <option value="sunny">Sunny</option>
            <option value="cloudy">Cloudy</option>
            <option value="rainy">Rainy</option>
            <option value="stormy">Stormy</option>
          </select>
        </div>

        <div>
          <label>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            required
          >
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="ok">Ok</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default DiaryForm;