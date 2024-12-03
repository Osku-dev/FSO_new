interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  if (!dailyHours || dailyHours.length === 0 || target < 0) {
    throw new Error(
      "Invalid input. Ensure daily hours array and a positive target are provided."
    );
  }

  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "excellent work, you met or exceeded your goal!";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to work harder to meet your target";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (
  args: string[]
): { dailyHours: number[]; target: number } => {
  if (args.length < 4) {
    throw new Error(
      "Not enough arguments. Provide daily exercise hours followed by the target."
    );
  }

  const dailyHours = args.slice(2, -1).map((arg) => {
    const num = Number(arg);
    if (isNaN(num)) {
      throw new Error("All daily exercise hours must be numbers.");
    }
    return num;
  });

  const target = Number(args[args.length - 1]);
  if (isNaN(target)) {
    throw new Error("Target must be a number.");
  }

  return { dailyHours, target };
};

try {
  const { dailyHours, target } = parseArguments(process.argv);
  const result = calculateExercises(dailyHours, target);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;
