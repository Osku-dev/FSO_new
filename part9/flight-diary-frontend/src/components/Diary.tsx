import { DiaryEntry } from '../types';

interface DiaryProps {
  entries: DiaryEntry[];
}

const Diary = ({ entries }: DiaryProps) => {
  return (
    <div>
      <h1>Diary Entries</h1>
      {entries.length === 0 ? (
        <p>No diary entries available.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <h3>{entry.date}</h3>
              <p><strong>Weather:</strong> {entry.weather}</p>
              <p><strong>Visibility:</strong> {entry.visibility}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Diary;