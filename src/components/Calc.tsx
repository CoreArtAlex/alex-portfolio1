import { useState } from 'react';
import './Calculate.css';

type Operator = '/' | '*' | '+' | '-' | '=';

const calculate: Record<Operator, (first: number, second: number) => number> = {
  '/': (first, second) => first / second,
  '*': (first, second) => first * second,
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '=': (_, second) => second,
};

function Calc() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | ''>('');
  const [awaitingNextValue, setAwaitingNextValue] = useState(false);

  const sendNumberValue = (number: string) => {
    if (awaitingNextValue) {
      setDisplay(number);
      setAwaitingNextValue(false);
    } else {
      setDisplay((prev) => (prev === '0' ? number : prev + number));
    }
  };

  const addDecimal = () => {
    if (awaitingNextValue) return;
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: Operator) => {
    const currentValue = parseFloat(display);

    if (operator && awaitingNextValue) {
      setOperator(nextOperator);
      return;
    }

    if (firstValue === null) {
      setFirstValue(currentValue);
    } else if (operator) {
      const result = calculate[operator](firstValue, currentValue);
      setDisplay(String(result));
      setFirstValue(result);
    }

    setAwaitingNextValue(true);
    setOperator(nextOperator);
  };

  const resetAll = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator('');
    setAwaitingNextValue(false);
  };

  return (
    <div className="calculator">
      <div className="calculator-display">
        <h1>{display}</h1>
      </div>
      <div className="calculator-buttons">
        <button
          className="operator"
          onClick={() => handleOperator('+')}
          value="+"
        >
          +
        </button>
        <button
          className="operator"
          onClick={() => handleOperator('-')}
          value="-"
        >
          -
        </button>
        <button
          className="operator"
          onClick={() => handleOperator('*')}
          value="*"
        >
          ×
        </button>
        <button
          className="operator"
          onClick={() => handleOperator('/')}
          value="/"
        >
          ÷
        </button>
        <button onClick={() => sendNumberValue('7')} value="7">
          7
        </button>
        <button onClick={() => sendNumberValue('8')} value="8">
          8
        </button>
        <button onClick={() => sendNumberValue('9')} value="9">
          9
        </button>
        <button onClick={() => sendNumberValue('4')} value="4">
          4
        </button>
        <button onClick={() => sendNumberValue('5')} value="5">
          5
        </button>
        <button onClick={() => sendNumberValue('6')} value="6">
          6
        </button>
        <button onClick={() => sendNumberValue('1')} value="1">
          1
        </button>
        <button onClick={() => sendNumberValue('2')} value="2">
          2
        </button>
        <button onClick={() => sendNumberValue('3')} value="3">
          3
        </button>
        <button className="decimal" onClick={addDecimal} value=".">
          .
        </button>
        <button onClick={() => sendNumberValue('0')} value="0">
          0
        </button>
        <button className="clear" onClick={resetAll} id="clear-btn">
          C
        </button>
        <button
          className="equal-sign operator"
          onClick={() => handleOperator('=')}
          value="="
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calc;
