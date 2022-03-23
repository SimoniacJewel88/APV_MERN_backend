// VeterinarioModel 
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,  //Eliminamos espacios en blanco al inicio y al final
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
});

/** 
 * La funcion pre() se utiliza para ejecutar algo justo antes del metodos save(),
 * 
 * Se usa una declaracion de funcion en lugar de un arrow function 
 * para hacer referancia en this al objeto que llama a la funcion
*/
veterinarioSchema.pre('save',async function(next) {
    // console.log(this);
    if (!this.isModified('password')) {
        next(); // este next() hace que el codigo continue al siguiente middleware(instruccion de rutas)
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

// Creamos una funcion de manera que solo se pueda ejecutar en el schema o modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    // Comparamos el password del POST con el almacenado en la base de datos
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Veterinario = mongoose.model("Veterinario",veterinarioSchema);
export default Veterinario;
// $2b$10$mYDAuGGLTE.lLWpGQjnOzOfiO4RK/Kjod504TqcP/HEWCfu7WY2Hu
// $2b$10$mYDAuGGLTE.lLWpGQjnOzOfiO4RK/Kjod504TqcP/HEWCfu7WY2Hu
// $2b$10$Et9OZ9i12j2H8litjTO3Eu2dtqUPnElBzj9arhpeq8G1hT1ViViSa