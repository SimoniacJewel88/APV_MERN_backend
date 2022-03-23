import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();
/** Asi leeremos los datos de request body y response body como un .JSON */
app.use(express.json());  // antes se utilizaba body parser, 
                          // ahora ya no es necesario pues es parte del core de express
/**
 * Funcion que escanea y busca los archivos 
 * .env en el proyecto automaticamente para 
 * leer las variables de entorno (environment)
 */
dotenv.config(); 

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request esta permitido 
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));


// console.log(process.env.MONGO_URI);

/** Asi es como express maneja el routing
 * req - (request) es lo que tu le estas enviando al servidor
 * res - (response) es la respuesta del servidor
 */
app.use('/api/veterinarios', veterinarioRoutes);

app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT , () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})

// console.log('Desde node.js')