import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");

  const handleClick = (value: string) => {
    const lastChar = input[input.length - 1];
    if (value === "." && (lastChar === "." || /[\+\-\*\/\%]$/.test(lastChar))) {
      return;
    }

    setInput((prevInput) => formatInput(prevInput + value));
  };

  const handleClear = () => {
    setInput("");
  };

  const handleCalculate = () => {
    try {
      let calcInput = input.replace(/,/g, ''); 

      // Remove trailing operators
      if (/[\+\-\*\/\%]$/.test(calcInput)) {
        calcInput = calcInput.slice(0, -1);
      }

      // Use mathjs to evaluate the input
      const result = evaluate(calcInput);
      setInput(formatNumber(result.toString()));
    } catch (error) {
      setInput("Error");
    }
  };

  const handlePercentage = () => {
    try {
      const result = evaluate(input.replace(/,/g, '') + "/100");
      setInput(formatNumber(result.toString()));
    } catch (error) {
      setInput("Error");
    }
  };

  const formatNumber = (num: string) => {
    if (!num) return "";
    return parseFloat(num).toLocaleString();
  };

  const formatInput = (input: string) => {
    let formatted = input.replace(/[^\d\.\+\-\*\/\%]/g, '');
    const decimalIndex = formatted.indexOf(".");

    if (decimalIndex !== -1) {
      const integerPart = formatted.substring(0, decimalIndex);
      const decimalPart = formatted.substring(decimalIndex);
      formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimalPart;
    } else {
      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return formatted;
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") {
      handleClick(e.key);
    } else if (/[\+\-\*\/]/.test(e.key)) {
      handleClick(e.key);
    } else if (e.key === "Enter") {
      const equalButton = document.querySelector('button[value="="]') as HTMLButtonElement;
      if (equalButton) {
        equalButton.click();
      }
    } else if (e.key === "Backspace") {
      handleClear();
    } else if (e.key === "%") {
      handlePercentage();
    } else if (e.key === ".") {
      handleClick(".");
    } else if (e.key === " ") {
      handleClear();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-50.5 bg-gray-100">
      <div className="flex items-center mb-6">
        <span className="text-[50px] font-extrabold text-orange-500">KBH</span>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <input
          type="text"
          value={input}
          disabled
          className="w-full p-4 text-3xl text-right border-2 border-gray-100 rounded mb-4"
        />
        <div className="grid grid-cols-4 gap-4">
          <button onClick={handleClear} className={btnClearStyles}>C</button>
          {["1", "2", "3", "+"].map((value) => (
            <button onClick={() => handleClick(value)} className={btnStyles} key={value} value={value}>
              {value}
            </button>
          ))}
          {["4", "5", "6", "-"].map((value) => (
            <button onClick={() => handleClick(value)} className={btnStyles} key={value} value={value}>
              {value}
            </button>
          ))}
          {["7", "8", "9", "*"].map((value) => (
            <button onClick={() => handleClick(value)} className={btnStyles} key={value} value={value}>
              {value}
            </button>
          ))}
          {["0", "/", "="].map((value) => (
            <button
              onClick={value === "=" ? handleCalculate : () => handleClick(value)}
              className={btnStyles}
              key={value}
              value={value}
            >
              {value}
            </button>
          ))}
          <button onClick={() => handleClick(".")} className={btnStyles}>.</button>
          <button onClick={handlePercentage} className={btnStyles + " col-span-2"}>%</button>
        </div>
      </div>
    </div>
  );
};

const btnStyles =
  "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition ease-in-out duration-300";

const btnClearStyles =
  "bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition ease-in-out duration-300";

export default Calculator;
