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
  
  
  try {
    console.log(bmiCalculator(70, 170)); // Normal weight
    console.log(bmiCalculator(90, 170)); // Obesity Class I
    console.log(bmiCalculator(50, 170)); // Underweight
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
  