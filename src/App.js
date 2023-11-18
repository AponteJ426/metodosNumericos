import './App.css';
import NewtonOptimization from './RaMult';
import { useState } from 'react';
import NewtonRootsMultiples from './userFunc';
import { Button } from 'react-bootstrap';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Grid } from '@mui/material';
import ModalInst from './modalInst';
import TextField from '@mui/material/TextField';





function App() {
  const [selectedValue, setSelectedValue] = useState("a");
  const [functionInput, setFunctionInput] = useState('');
  const [render, setrender] = useState(false);
  const [sencondRender, setSecondRender] = useState(true);

  const handleClear = () => {
    setFunctionInput("")
  }
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setrender(!render);
    setSecondRender(!sencondRender);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='titleApp'>NumericWeb</h1>
        <TextField 
        sx={{ width: "20rem",mt: "5rem", }} 
        label={"Ejemplo: ' x^2 + 2*x + 1 '"}
        variant="standard" 
        id="inputFunc" 
        value={functionInput} onChange={(e) => setFunctionInput(e.target.value)} />
        <Grid container sx={{display: "flex", justifyContent: "center",margin: "1rem"}}>
          <Grid >
            <ModalInst />
          </Grid>
        </Grid>
        <Grid className='containerRadio' sx={{
          margin: "3rem",
          mt: "1rem",
          color: "#fff",
          border: "1px solid #fff",
          borderRadius: 5,
          boxShadow: 10,
          padding: "2rem"
        }}>
          <FormControl>
            <FormLabel id="demo-form-control-label-placement" sx={{ color: "white", mb: 2, }} >Elige Que Metodo Quieres Usar :</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-form-control-label-placement"
              name="position"
              defaultValue="top"
            >
              <FormControlLabel
                sx={{ width: "10rem" }}
                value="a"
                checked={selectedValue === "a"}
                onChange={handleChange}
                control={<Radio />}
                label="Optimizacion Metodo De Newton"
                labelPlacement="top"
              />
              <FormControlLabel
                value="b"
                sx={{ width: "10rem" }}
                checked={selectedValue === "b"}
                onChange={handleChange}
                control={<Radio />}
                label="Newton Rhapson Raices Multiples"
                labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        < Button  variant="outline-danger" onClick={handleClear}>Limpiar</Button>
        {render && <NewtonRootsMultiples functionInput={functionInput} />}
        {sencondRender && <NewtonOptimization functionInput={functionInput} />}

      </header>
    </div>
  );
}

export default App;
