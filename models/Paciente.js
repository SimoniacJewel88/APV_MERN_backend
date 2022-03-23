import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        // Almacenamos una referencia al veterinario por su id
        type: mongoose.Schema.Types.ObjectId,
        // Colocamos el mismo nombre como lo hayamos nombrado en el modelo Veterinario
        ref: "Veterinario",
    },
}, {
    // Con eso creara las columnas de editado y creado
    timestamps: true,
});

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;