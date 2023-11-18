import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import 'animate.css';

   

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Sigue Las Indicaciones Para Usar La Web
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>¿Como pasar la función?</h4>
                <p>
                    Debes Ingresar Parámetros Así:
                    <br />
                    Potenciacion: x^y usando el símbolo "^"
                    <br />
                    Algebraica: 5 * x usando el símbolo "*"
                    <br />
                    Trigonométrica: sin(x)  usando el símbolo "sin"
                    <br />
                    Trigonométrica: cos(x)  usando el símbolo "cos"
                    <br />
                    Trigonométrica : tan(x)  usando el símbolo  "tan"
                    <br />
                    Trigonométrica : cot(x)  usando el símbolo  "cot"
                    <br />
                    Trigonométrica : sec(x)  usando el símbolo  "sec"
                    <br />
                    Trigonométrica : csc(x)  usando el símbolo  "csc"
                    <br />
                    Trigonométrica : arcsin(x)  usando el símbolo  "arcsin"
                    <br />
                    Un Ejemplo De Función Escrita Sería:"x^2 + 5*x + 3"


                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function ModalInst() {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
         <Box pla className="animate__animated animate__tada animate__slow animate__infinite" sx={{ '& > :not(style)': { m: 1 } }}>
      <abbr title="Conoce Como Usar La Web ">
      <Fab color="primary" aria-label="add" onClick={() => setModalShow(true)}>
        <QuestionMarkIcon />
      </Fab>
      </abbr>
    </Box>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

