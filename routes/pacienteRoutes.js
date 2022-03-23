import express from "express";
const router = express.Router();
import { 
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente,
    probandoParams,
} from '../controllers/pacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

router.route('/prueba/:prueba').get(checkAuth, probandoParams);

router.route('/')
    //protegemos el metodo post con un checkAuth para verificar el veterinario
    .post(checkAuth, agregarPacientes)
    //protegemos el metodo get para asgurarnos que solo el veterinario logeado vea al paciente
    .get(checkAuth, obtenerPacientes);

router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente);

export default router;
