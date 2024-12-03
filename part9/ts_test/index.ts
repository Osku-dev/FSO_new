import express, { Request, Response } from "express";
import { bmiCalculator } from "./bmiCalculator";
import { calculateExercises} from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req: Request, res: Response): void => {
  const weight = req.query.weight as string;
  const height = req.query.height as string;

  if (!weight || !height) {
    res
      .status(400)
      .json({ error: "Parameters 'weight' and 'height' are required." });
    return;
  }

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  if (
    isNaN(weightNum) ||
    isNaN(heightNum) ||
    weightNum <= 0 ||
    heightNum <= 0
  ) {
    res.status(400).json({
      error: "Parameters 'weight' and 'height' must be valid positive numbers.",
    });
    return;
  }

  try {
    const bmiResult = bmiCalculator(weightNum, heightNum);
    res.json({
      weight: weightNum,
      height: heightNum,
      bmi: bmiResult,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "An unexpected error occurred.", details: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred.", details: "Unknown error" });
    }
  }
});

app.post('/exercises', (req: Request, res: Response): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const { daily_exercises, target }: any = req.body;

  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((n) => typeof n === 'number') ||
    typeof target !== 'number'
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const result = calculateExercises(daily_exercises, target);
  res.json(result);
  return; 
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
