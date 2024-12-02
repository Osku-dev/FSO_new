const bmiCalculator = (weight: number, height: number): string => {
    if (weight <= 0 || height <= 0) {
      throw new Error("Weight and height must be positive values.");
    }
  
    const heightInMeters = height / 100;
  
    const bmi = weight / (heightInMeters * heightInMeters);
  
    let result: string;
  
    switch (true) {
      case (bmi < 18.5):
        result = "Underweight";
        break;
      case (bmi >= 18.5 && bmi < 24.9):
        result = "Normal weight";
        break;
      case (bmi >= 25 && bmi < 29.9):
        result = "Overweight";
        break;
      case (bmi >= 30 && bmi < 34.9):
        result = "Obesity Class I";
        break;
      case (bmi >= 35 && bmi < 39.9):
        result = "Obesity Class II";
        break;
        case bmi >= 40:
            result = "Obesity Class III";
            break;
          default:
            throw new Error("Unexpected BMI value.");
    }
  
    return `Your BMI is ${bmi.toFixed(2)} (${result}).`;
  }
  
  interface BmiInput {
    weight: number;
    height: number;
  }
  
  const parseArguments = (args: string[]): BmiInput => {
    if (args.length < 4) {
      throw new Error('Not enough arguments. Provide weight (kg) and height (cm).');
    }
    if (args.length > 4) {
      throw new Error('Too many arguments. Provide only weight (kg) and height (cm).');
    }
  
    const weight = Number(args[2]);
    const height = Number(args[3]);
  
    if (isNaN(weight) || isNaN(height)) {
      throw new Error('Provided values must be numbers.');
    }
  
    if (weight <= 0 || height <= 0) {
      throw new Error('Weight and height must be positive numbers.');
    }
  
    return {
      weight,
      height,
    };
  };
  
  if (require.main === module) {
  try {
    const { weight, height } = parseArguments(process.argv);
    console.log(bmiCalculator(weight, height));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}

export { bmiCalculator };
  