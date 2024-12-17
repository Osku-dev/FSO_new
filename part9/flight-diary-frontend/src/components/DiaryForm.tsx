import { useState } from "react";
import { NewDiaryEntry, Weather, Visibility, DiaryEntry } from "../types";
import { createDiary } from "../services/diaryService";
import axios from "axios";

interface DiaryFormProps {
  addDiary: (newDiary: DiaryEntry) => void;
}

const DiaryForm = ({ addDiary }: DiaryFormProps) => {
  const [date, setDate] = useState<string>("");
  const [weather, setWeather] = useState<Weather>("sunny" as Weather);
  const [visibility, setVisibility] = useState<Visibility>(
    "great" as Visibility
  );
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newDiaryEntry: NewDiaryEntry = { date, weather, visibility, comment };

    try {
      const createdDiary = await createDiary(newDiaryEntry);
      addDiary(createdDiary);
      setDate("");
      setWeather("sunny" as Weather);
      setVisibility("great" as Visibility);
      setComment("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fullMessage =
          error.response?.data || "Failed to save diary entry to the backend.";
        const errorMessage = fullMessage.includes("Error:")
          ? fullMessage.split("Error:")[1].trim()
          : fullMessage;

        alert(`Error: ${errorMessage}`);
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
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
          <div>
            {(["sunny", "cloudy", "rainy", "stormy"] as Weather[]).map(
              (option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="weather"
                    value={option}
                    checked={weather === option}
                    onChange={() => setWeather(option)}
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              )
            )}
          </div>
        </div>

        <div>
          <label>Visibility</label>
          <div>
            {(["great", "good", "ok", "poor"] as Visibility[]).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={() => setVisibility(option)}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
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
