// Controlador del veterinario
import Veterinario from "../models/Veterinario.js";
import { generarJWT } from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

/**
 * Registrar un Usuario
 */
const registrar = async (req, res) => {
    // res.json({ url: "Desde API/VETERINARIOS"});
    // console.log(req.body);
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}); //findOne({email: email})

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });       
    }

    try {
        // Guardar un Nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email de confirmacion
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);  //POST
    } catch (error) {
        console.log(error);
    }

    
};

const perfil = (req, res) => {
    // res.json({ url: "Desde API/VETERINARIOS/perfil"});
    const { veterinario } = req;
    res.json( veterinario ); //POST
};

const confirmar = async (req, res) => {
    console.log(req.params.token); //leemos los parametros de la URL
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token: token});

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');  
        return res.status(404).json({msg: error.message});      
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente...'})
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    // Comprobar si el usuario existe 
    const usuario = await Veterinario.findOne({email});    

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });   
    }

    // Comprobar si el usuario esta confirmado 
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message });   
    }

    // Autenticar al usuario 
        // Revisar si el password esta bien
    if ( await usuario.comprobarPassword(password)) {
        console.log(usuario);
        // Autenticar 
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error('El Password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });
    console.log(existeVeterinario);
    if(!existeVeterinario) {
        const error = new Error('El Usuario no existe');
        return res.status(400).json({ msg: error.message })
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email con las instrucciones
        emailOlvidePassword({
            email,
            nombree: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });


        return res.json({ msg: 'Hemos enviado un email con las instrucciones'});

    } catch (error) {
        console.log(error);
    }
};


const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido) {
        // El token en válido, el usuario existe
        res.json({ msg: 'Token valido, el usuario existe'});
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }
};


const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(404).json({ msg: error.message })
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Password modificado correctamente"});
        console.log(veterinario);        
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({ msg: error.message });
        }
    }

    // Si todo esta OK, entonces vamos a utilizar un try - catch
    try {  
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        // regresamos este Veterinario actualizado para actualizar el state del authcontext
        res.json(veterinarioActualizado); 
    }catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // console.log(req.veterinario);
    // console.log(req.body);

    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)) {
        // console.log('correcto');
        veterinario.password = pwd_nuevo;
        await veterinario.save(); //aqui actua un presave del modelo Veterinario.jsx
        res.json({msg: "Password almacenado correctamente"});
    } else {
        const error = new Error('El password Actual es incorrecto');
        return res.status(400).json({ msg: error.message });
    }

    // Almacenar el nuevo password
};

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};