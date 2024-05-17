const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar conexión a MongoDB
mongoose.connect('mongodb+srv://progamadornodejs:JnjOsprqCMOoXRFm@cluster0.sq9yf7o.mongodb.net/grupoDos?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const Registro = mongoose.model('Registro', {
    conductor: String,
    fechaInicio: String,
    fechaFin: String,
    numTerritorio: Number
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/grupoDos/registros', async (req, res) => {
    try {
        const registros = await Registro.find().sort({ numTerritorio: 1 }); // Ordenar por numTerritorio ascendente
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/grupoDos/registros', async (req, res) => {
    const { conductor, fechaInicio, fechaFin, numTerritorio } = req.body;
    const registro = new Registro({
        conductor,
        fechaInicio,
        fechaFin,
        numTerritorio
    });

    try {
        await registro.save();
        const registros = await Registro.find().sort({ numTerritorio: 1 }); // Ordenar por numTerritorio ascendente
        res.status(201).json(registros);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/grupoDos/registros/:id', async (req, res) => {
    try {
        await Registro.findByIdAndDelete(req.params.id);
        const registros = await Registro.find().sort({ numTerritorio: 1 }); // Ordenar por numTerritorio ascendente
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para descargar la tabla en formato PDF
app.get('/grupoDos/registros/pdf', async (req, res) => {
    try {
        const registros = await Registro.find().sort({ numTerritorio: 1 }); // Obtener registros de la base de datos

        // Estilos CSS en línea para la tabla
        const styles = `
            <style>
                body {
                    background-color: #f0f0f0;
                    color: #555;
                    font-family: 'Arial', sans-serif;
                    margin: 25px;
                    padding: 0;
                }

                table {
                    width: 100%;
                    max-width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #2c3e50;
                    margin-bottom: 20px;
                    background-color: white;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }

                th, td {
                    border: 2px solid #2c3e50;
                    padding: 15px;
                    text-align: center;
                    color: black; /* Cambiado a negro */
                    background-color: white; /* Color de fondo blanco */
                }

                th {
                    background-color: #2c3e50;
                    color: #000; /* Cambiado a negro */
                    font-weight: bold;
                    text-transform: uppercase;
                }

                tbody tr:nth-child(even) {
                    background-color: #ecf0f1;
                }

                tbody tr:hover {
                    background-color: #d5dbdb;
                }

                .title {
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 20px;
                    color: #2c3e50;
                    text-transform: uppercase;
                    font-weight: bold;
                }

                /* Sombras sutiles en las celdas de los registros */
                tbody tr:hover td {
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

               

                .download-link:hover {
                    background-position: -100% 0;
                    color: #000; /* Cambia el color del texto al pasar el cursor */
                }
            </style>
        `;

        // Construir el HTML de la tabla con los estilos CSS incluidos
        let tableHTML = `
            ${styles}
            <div class="title"><br><br>Registro de Conductores - Grupo 2</div>
            <table>
                <thead>
                    <tr>
                        <th style="color: #000;">Num de Territorio</th>
                        <th style="color: #000;">Conductor</th>
                        <th style="color: #000;">Fecha de Inicio</th>
                        <th style="color: #000;">Fecha de Fin</th>
                    </tr>
                </thead>
                <tbody>
                    ${registros.map(registro => `
                        <tr>
                            <td>${registro.numTerritorio}</td>
                            <td>${registro.conductor}</td>
                            <td>${registro.fechaInicio}</td>
                            <td>${registro.fechaFin}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
        `;

        // Iniciar navegador Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Generar PDF
        await page.setContent(tableHTML);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Enviar PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="registros.pdf"');
        res.send(pdfBuffer);

        // Cerrar navegador
        await browser.close();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
