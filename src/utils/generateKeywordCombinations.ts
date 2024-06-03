const generateKeywordCombinations = (inputString: string): string[] => {
  const inputArray: string[] = inputString.split(""); 
  const combinations: string[] = []; 

  for (let i = 0; i < inputArray.length; i++) {
    let substring: string = "";
    for (let j = i; j < inputArray.length; j++) {
      substring += inputArray[j];
      if (substring.trim() !== "" && !substring.startsWith(" ")) {
        combinations.push(substring);
      }
    }
  }

  return combinations;
};

export default generateKeywordCombinations;