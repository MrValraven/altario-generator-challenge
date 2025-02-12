import { GridCharacter, GridAndSecretCode, SecretCode } from "./types";

type FrequencyOfCharactersInGrid = {
  [key in GridCharacter]?: number;
};

interface GeneratedGrid {
  grid: GridCharacter[][];
  frequencyOfCharactersInGrid: FrequencyOfCharactersInGrid;
}

type UpdateFrequencyAction = "increment" | "decrement";

const getGridMethod = (bias: GridCharacter | undefined): GridAndSecretCode => {
  const generatedGrid = generateGrid(bias);
  const secretCode = generateCode(generatedGrid);

  return { grid: generatedGrid.grid, secretCode };
};

const getRandomCharacter = (): GridCharacter => {
  const ALPHABET_IN_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = Math.floor(Math.random() * ALPHABET_IN_LOWERCASE.length);
  return ALPHABET_IN_LOWERCASE[randomIndex] as GridCharacter;
};

const generateGrid = (biasCharacter: GridCharacter | undefined): GeneratedGrid => {
  const NUMBER_OF_ROWS = 10;
  const NUMBER_OF_COLUMNS = 10;
  const BIAS_CELL_QUOTA = Math.floor(NUMBER_OF_ROWS * NUMBER_OF_COLUMNS * 0.2);
  const frequencyOfCharactersInGrid: FrequencyOfCharactersInGrid = {};
  const grid: GridCharacter[][] = [];

  const updateFrequencyInGrid = (character: GridCharacter, updateFrequencyAction: UpdateFrequencyAction) => {
    const frequencyOfCurrentCharacter = frequencyOfCharactersInGrid[character]
      ? frequencyOfCharactersInGrid[character]
      : 0;

    frequencyOfCharactersInGrid[character] =
      frequencyOfCurrentCharacter + (updateFrequencyAction === "increment" ? 1 : -1);
  };

  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    grid[row] = [];

    for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
      let chosenCharacter = getRandomCharacter();
      const frequencyOfBiasCharacter = biasCharacter && (frequencyOfCharactersInGrid[biasCharacter] ?? 0);

      if (
        chosenCharacter === biasCharacter &&
        frequencyOfBiasCharacter &&
        frequencyOfBiasCharacter >= BIAS_CELL_QUOTA
      ) {
        while (chosenCharacter === biasCharacter) {
          chosenCharacter = getRandomCharacter();
        }
      }

      updateFrequencyInGrid(chosenCharacter, "increment");
      grid[row][column] = chosenCharacter;
    }
  }

  if (biasCharacter) {
    let filledBiasCount = frequencyOfCharactersInGrid[biasCharacter] ?? 0;

    while (filledBiasCount < BIAS_CELL_QUOTA) {
      const row = Math.floor(Math.random() * NUMBER_OF_ROWS);
      const column = Math.floor(Math.random() * NUMBER_OF_COLUMNS);
      const isBiasCharacterAlreadyInCell = grid[row][column] === biasCharacter;

      if (isBiasCharacterAlreadyInCell) {
        continue;
      }

      const characterInCurrentGridCell = grid[row][column];

      grid[row][column] = biasCharacter;
      filledBiasCount++;
      updateFrequencyInGrid(biasCharacter, "increment");
      updateFrequencyInGrid(characterInCurrentGridCell, "decrement");
    }
  }

  const totalCharacters = Object.values(frequencyOfCharactersInGrid).reduce((sum, value) => sum + value, 0);
  console.log(biasCharacter && frequencyOfCharactersInGrid[biasCharacter]);
  console.log(totalCharacters);

  return { grid, frequencyOfCharactersInGrid };
};

const isNumberPrime = (number: number): boolean => {
  if (number <= 1) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
};

function getPrimesUpToLimit(limit: number): number[] {
  const primeNumbers: number[] = [];

  for (let i = 2; i <= limit; i++) {
    if (isNumberPrime(i)) {
      primeNumbers.push(i);
    }
  }

  return primeNumbers;
}

const getDigitDividedByMinimumDivisibleInteger = (digit: number): number => {
  const MAX_GRID_LENGTH = 100;
  const collectionOfMinimumDivisibleIntegers = getPrimesUpToLimit(MAX_GRID_LENGTH);

  for (let i = 0; i <= collectionOfMinimumDivisibleIntegers.length; i++) {
    if (digit % collectionOfMinimumDivisibleIntegers[i] === 0) {
      return digit / collectionOfMinimumDivisibleIntegers[i];
    }
  }

  return digit;
};

const getFinalDigitForSecretCode = (digit: number): number => {
  if (digit < 1 || digit > 100) {
    throw new Error(`digit[${digit}] is out of bounds. Value should be between 1 and 100`);
  }

  if (digit <= 9) {
    return digit;
  }

  let finalDigit = digit;

  while (finalDigit >= 9) {
    finalDigit = getDigitDividedByMinimumDivisibleInteger(finalDigit);
  }

  return finalDigit;
};

const getCurrentSecondsInTwoDigitFormat = (): [number, number] => {
  const currentTime = new Date();
  const digits = currentTime.getSeconds().toString().padStart(2, "0");
  return [parseInt(digits[0]), parseInt(digits[1])];
};

const generateCode = (generatedGrid: GeneratedGrid) => {
  const { grid, frequencyOfCharactersInGrid } = generatedGrid;

  const [firstDigit, secondDigit] = getCurrentSecondsInTwoDigitFormat();

  const firstCharacter = grid[firstDigit][secondDigit];
  const secondCharacter = grid[secondDigit][firstDigit];

  const numberOfOccurrencesFirstCharacter = frequencyOfCharactersInGrid[firstCharacter];
  const numberOfOccurrencesSecondCharacter = frequencyOfCharactersInGrid[secondCharacter];

  const finalFirstDigit =
    numberOfOccurrencesFirstCharacter && getFinalDigitForSecretCode(numberOfOccurrencesFirstCharacter);
  const finalSecondDigit =
    numberOfOccurrencesSecondCharacter && getFinalDigitForSecretCode(numberOfOccurrencesSecondCharacter);

  return `${finalFirstDigit}${finalSecondDigit}` as SecretCode;
};

export { getGridMethod };
