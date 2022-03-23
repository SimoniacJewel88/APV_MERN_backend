import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // console.log('si hay token y Bearer');
        try {
            token = req.headers.authorization.split(' ')[1];
            /**
             * Verify Toma como parametros
             * @param - el token a verificar
             * @param - la palabra secreta en .env 
             */
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Crearemos una session del veterinario asì:
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");
            return next();            
            
        } catch (error) {
            const e = new Error('Token no valido');
            return res.status(403).json({msg: e.message});
        }        
    }

    if (!token) {
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({msg: error.message});   
    }
    next(); // Repasar esta parte
};

export default checkAuth;