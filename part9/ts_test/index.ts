import express, { Request, Response } from 'express';
import {bmiCalculator} from './bmiCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response): void => {
    const weight = req.query.weight as string;
    const height = req.query.height as string;
  
    if (!weight || !height) {
      res.status(400).json({ error: "Parameters 'weight' and 'height' are required." });
      return;
    }
  
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
  
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      res.status(400).json({ error: "Parameters 'weight' and 'height' must be valid positive numbers." });
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
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});