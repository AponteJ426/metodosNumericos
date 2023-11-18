import React, { useCallback, useEffect, useState } from 'react';
import functionPlot from 'function-plot';
import { derivative, parse } from 'mathjs';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Grid } from '@mui/material';

export default function NewtonRootsMultiples({ functionInput, clear }) {
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [error, setError] = useState(null);
  const [functionValue, setFunctionValue] = useState(null);
  const [render, setRender] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [rootPoints, setRootPoints] = useState([]);

  const evaluateFunction = (x) => {
    const compiledFunction = parse(functionInput).compile();
    return compiledFunction.evaluate({ x });
  };

  const evaluateDerivative = (x) => {
    const derivativeExpression = derivative(parse(functionInput), 'x');
    const compiledDerivative = derivativeExpression.compile();
    return compiledDerivative.evaluate({ x });
  };

  const evaluateMultiplicity = (x) => {
    const derivativeExpression = derivative(parse(functionInput), 'x');
    const compiledDerivative = derivativeExpression.compile();
    return compiledDerivative.evaluate({ x });
  };

  const newtonRootsMultiples = (x0, stepSize = 0.5) => {
    const maxError = 1;
    const maxIterations = 50;

    let x = x0;
    let currentError = Infinity;
    let currentIteration = 0;
    let iterationsData = [];
    let rootsData = [];

    while (Math.abs(currentError) > maxError && currentIteration < maxIterations) {
      const fpx = evaluateDerivative(x);
      const multiplicity = evaluateMultiplicity(x);
      const value = evaluateFunction(x);
    
      const nextX = x - (value * fpx) / (multiplicity * fpx);
    
      currentError = Math.abs(nextX - x);
    
      const nextValue = evaluateFunction(nextX);
    
      iterationsData.push({
        iteration: currentIteration,
        initialValue: x,
        finalValue: nextX,
        derivative: fpx,
        multiplicity: multiplicity,
        error: currentError,
        functionValue: nextValue,
      });
    
      rootsData.push([nextX, 0]);
    
      x = nextX;
      currentIteration++;
    }

    setIterations(iterationsData);
    setRootPoints(rootsData);
    setResult(x);
    setError(currentError);
    if (iterationsData.length > 0) {
      setFunctionValue(iterationsData[iterationsData.length - 1].functionValue);
    }
  };

  const handleSubmit = () => {
    const initialGuess = 0.1;
    setRender(false);
    setIterations([]);
    setResult(null);
    setError(null);
    setFunctionValue(null);
    setShowTable(true);

    newtonRootsMultiples(initialGuess);
  };

  if (clear === true) {
    setResult(null);
    setIterations([]);
    setError(null);
    setFunctionValue(null);
    setShowTable(false);
  }

  const graphic = useCallback(() => {
    try {
      functionPlot({
        width: 776,
        target: '#graphicRM',
        data: [
          {
            fn: `${functionInput}`,
          },
          {
            points: rootPoints,
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
  }, [functionInput, rootPoints]);

  useEffect(() => {
    graphic();
  }, [graphic, render, clear]);

  return (
    <div>
      <Button variant="outline-success" onClick={handleSubmit}>calcular </Button>
      {isNaN(result) && (
        <div className='containerMethods'>
          <p>El resultado es indeterminado.</p>
        </div>)
      }

      {functionInput !== "" && result !== null && !isNaN(result) && (
        <div className='containerMethods'>
        < Grid sx={{
          background: "#c6fdfd",
          borderRadius: 5,
          boxShadow: 10,
          border: "1px solid #fff",
          padding: "2rem",
          width: "790",
          margin: "3rem" 
          }} id="graphicRM" />
          <p>Función: {functionInput}</p>
          <p>Derivada: {iterations.length > 0 ? iterations[iterations.length - 1].derivative : ''}</p>
          <p>Error aproximado: {error}</p>
          <p>Valor del Extremo: {result}</p>
          <p> Extremo: {rootPoints}</p>
          <p>Valor de la función: {functionValue}</p>
          {showTable && (
            <div className='containeTable'>
              <p>Iteraciones:</p>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Iteración</th>
                    <th>Valor inicial (x)</th>
                    <th>Valor final (x)</th>
                    <th>Derivada</th>
                    <th>Multiplicidad</th>
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
                      <td>{iteration.multiplicity.toFixed(6)}</td>
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
