import React, { useCallback, useEffect, useState } from 'react';
import functionPlot from 'function-plot';
import { derivative, evaluate, parse } from 'mathjs';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { Grid } from '@mui/material';

export default function NewtonOptimization({ functionInput, clear }) {
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [error, setError] = useState(null);
  const [functionValue, setFunctionValue] = useState(null);
  const [render, setRender] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [extremaPoints, setExtremaPoints] = useState([]);

  const evaluateFunction = (x) => {
    const compiledFunction = parse(functionInput).compile();
    return compiledFunction.evaluate({ x });
  };

  const evaluateDerivative = (x) => {
    const derivativeExpression = derivative(parse(functionInput), 'x');
    const compiledDerivative = derivativeExpression.compile();
    return compiledDerivative.evaluate({ x });
  };

  const evaluateSecondDerivative = (x) => {
    const secondDerivativeExpression = derivative(derivative(parse(functionInput), 'x'), 'x');
    const compiledSecondDerivative = secondDerivativeExpression.compile();
    return compiledSecondDerivative.evaluate({ x });
  };

  const newtonOptimization = (x0, stepSize = 0.5) => {
    const maxError = 1;
    const maxIterations = 50;

    let x = x0;
    let currentError = Infinity;
    let currentIteration = 0;
    let iterationsData = [];
    let extremaData = [];

    while (Math.abs(currentError) > maxError && currentIteration < maxIterations) {
      const fpx = evaluateDerivative(x);
      const fppx = evaluateSecondDerivative(x); // Calculate second derivative within the loop
      const value = evaluateFunction(x);

      const nextX = x - fpx / fppx;
      currentError = Math.abs(nextX - x);

      iterationsData.push({
        iteration: currentIteration,
        initialValue: x,
        finalValue: nextX,
        derivative: fpx,
        secondDerivative: fppx,
        error: currentError,
        functionValue: value,
      });

      // Check for extrema
      if (fppx !== 0) {
        if (fppx > 0) {
          extremaData.push({ x: nextX, y: value, type: 'min' });
        } else {
          extremaData.push({ x: nextX, y: value, type: 'max' });
        }
      }

      x = nextX;
      currentIteration++;
    }

    // Update state with all extrema points
    setExtremaPoints(extremaData);

    setIterations(iterationsData);
    setResult(x);
    setError(currentError);
    if (iterationsData.length > 0) {
      setFunctionValue(iterationsData[iterationsData.length - 1].functionValue);
    }
  };

  const determineExtremumType = () => {
    if (iterations.length > 0) {
      const lastIteration = iterations[iterations.length - 1];
      if (lastIteration.secondDerivative > 0) {
        return 'Mínimo';
      } else if (lastIteration.secondDerivative < 0) {
        return 'Máximo';
      } else {
        return 'Indeterminado (punto de inflexión)';
      }
    }
    return '';
  };

  const handleSubmit = () => {
    const initialGuess = 0.1;
    setRender(false);
    setIterations([]);
    setResult(null);
    setError(null);
    setFunctionValue(null);
    setShowTable(true);

    newtonOptimization(initialGuess);
  };

  const graphic = useCallback(() => {
    try {
      functionPlot({
        width: 776,
        target: '#graphicOM',
        data: [
          {
            fn: `${functionInput}`,
          },
          {
            points: extremaPoints,
            fnType: 'points',
            graphType: 'scatter',
            color: 'red', // Customize color for extrema points
            attr: {
              r: 5, // Customize radius for extrema points
            },
          },
          {
            points: [[result, 0]],
            fnType: 'points',
            graphType: 'scatter',
            color: 'white',
            attr: {
              r: 3,
            },
          },
        ],
        tip: {
          xLine: true,
          yLine: true,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [functionInput, result, extremaPoints]);

  useEffect(() => {
    graphic();
  }, [graphic, render, clear]);

  return (
    <div>
      <Button variant="outline-success" onClick={handleSubmit}>
        Calcular
      </Button>
      {isNaN(result) && (
        <div className="containerMethods">
          <p>El resultado es indeterminado.</p>
        </div>
      )}

      {functionInput !== '' && result !== null && (
        <div className="containerMethods">
          <h1>Optimizacion Unidimensional Metodo De Newton</h1>
          <Grid
            sx={{
              background: '#c6fdfd',
              borderRadius: 5,
              boxShadow: 10,
              border: '1px solid #fff',
              padding: '2rem',
              margin: '3rem',
            }}
            id="graphicOM"
          />
          <p>Función: {functionInput}</p>
          <p>Derivada: {iterations.length > 0 ? iterations[iterations.length - 1].derivative : ''}</p>
          <p>Segunda Derivada: {iterations.length > 0 ? iterations[iterations.length - 1].secondDerivative : ''}</p>
          <p>Error aproximado: {error}</p>
          <p>Tipo de Extremo: {determineExtremumType()}</p>
          <p>Valor del Extremo: {result}</p>
          <p>Valor de la función: {functionValue}</p>
          {showTable && (
            <div className="containeTable">
              <p>Iteraciones:</p>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>Valor inicial (x)</th>
                    <th>Valor final (x)</th>
                    <th>Derivada</th>
                    <th>Segunda Derivada</th>
                    <th>Error</th>
                    <th>Valor de la función</th>
                  </tr>
                </thead>
                <tbody>
                  {iterations.map((iteration) => (
                    <tr key={iteration.iteration}>
                      <td>{iteration.iteration}</td>
                      <td>{iteration.initialValue.toFixed(6)}</td>
                      <td>{iteration.finalValue.toFixed(6)}</td>
                      <td>{iteration.derivative.toFixed(6)}</td>
                      <td>{iteration.secondDerivative.toFixed(6)}</td>
                      <td>{iteration.error.toFixed(6)}</td>
                      <td>{iteration.functionValue.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
