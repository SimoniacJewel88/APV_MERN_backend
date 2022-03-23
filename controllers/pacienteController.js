import Paciente from "../models/Paciente.js";

const agregarPacientes = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        /** Identificamos primero que Veterinario es el que esta registrando ese paciente
         * podemos acceder a la VARIABLE DE EXPRESS de veterinario
         */
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error); 
    }

};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes)
};
/** Obtiene un paciente en especifico */
const obtenerPaciente = async (req, res) => {
    // console.log(req.params.id);
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
    }
    // console.log(paciente.veterinario._id);
    // console.log(req.veterinario._id);
    // Se convierten el un string para que no se comparen como Object.id
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }
    res.json(paciente);   
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
    }

    // Se convierten el un string para que no se comparen como Object.id
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }
    // Actualizar paciente 
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
        
    } catch (error) {
        console.log(error);
    }
}


const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
    }
    // Se convierten el un string para que no se comparen como Object.id
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: "Accion no valida"});
    }

    try {
        const pacienteEliminado = await paciente.deleteOne();
        // res.json({ msg: "Paciente Eliminado"});
        res.json(pacienteEliminado);
    } catch (error) {
        console.log(error)
    }
}

const probandoParams = async (req, res) => {
    res.json({ msg: "Hola Mundo"});
    console.log(req.params);
}

export {
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente,
    probandoParams,
}