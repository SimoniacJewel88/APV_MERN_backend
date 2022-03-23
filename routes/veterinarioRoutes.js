import express from 'express';
const router = express.Router();
import { 
    registrar,
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js'
import checkAuth from '../middleware/authMiddleware.js';

///////////////// AREA PUBLICA //////////////////////
/** 
 * req - (request) es lo que tu le estas enviando al servidor
 * res - (response) es la respuesta del servidor
 */
// router.get('/', registrar);
router.post('/', registrar);

/**
 * Esto es un router DINAMICO
 */
router.get('/confirmar/:token', confirmar);

router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
/** Ruta para enviarle al usuario un token para leerlo desde la URL */
// router.get('/olvide-password/:token', comprobarToken);
/** Ruta para que el usuario defina aqui su password nuevo */
// router.post('/olvide-password/:token', nuevoPassword);

// aplicando chaining hace exactamente lo mismo pero en una sola linea.
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);



///////////////// AREA PRIVADA //////////////////////

/** Creamos un routing para login del perfil veterinario */
// router.get('/perfil', perfil);
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password/', checkAuth, actualizarPassword);

export default router;