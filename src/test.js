import React from 'react';
import { Button, Table } from 'react-bootstrap';

function NewtonMethod({ func }) {
  const initialGuess = 1; // Valor inicial
  const maxIterations = 10; // Número máximo de iteraciones
  const tolerance = 0.0001; // Tolerancia para el error aproximado

  const iterations = [];

  let x = initialGuess;
  let error = Infinity;

  for (let i = 0; i < maxIterations && error > tolerance; i++) {
    const fx = func(x);
    const dfx = derivative(func, x);
    const d2fx = secondDerivative(func, x);

    const nextX = x - (fx * dfx) / (Math.pow(dfx, 2) - fx * d2fx);
    error = Math.abs(nextX - x);

    iterations.push({
      iteration: i + 1,
      x,
      fx,
      dfx,
      d2fx,
      error,
    });

    x = nextX;
  }

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Iteración</th>
          <th>x</th>
          <th>f(x)</th>
          <th>f'(x)</th>
          <th>f''(x)</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        {iterations.map((iteration) => (
          <tr key={iteration.iteration}>
            <td>{iteration.iteration}</td>
            <td>{iteration.x}</td>
            <td>{iteration.fx}</td>
            <td>{iteration.dfx}</td>
            <td>{iteration.d2fx}</td>
            <td>{iteration.error}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

// Función para calcular la derivada numérica
function derivative(func, x) {
  const h = 0.0001; // Tamaño del paso
  return (func(x + h) - func(x - h)) / (2 * h);
}

// Función para calcular la segunda derivada numérica
function secondDerivative(func, x) {
  const h = 0.0001; // Tamaño del paso
  return (func(x + h) - 2 * func(x) + func(x - h)) / Math.pow(h, 2);
}

export default NewtonMethod;
