// Funciones de consultas 

const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "jesus4ever",
    port: 5432,
    database: "bancosolar",
});

const insertar = async (datos) => {

    // Objeto q contiene consulta
    const consulta = {
        text: "INSERT INTO usuarios values($1,$2)",
        values: datos,
    };

    // Capturando error sino se conecta 
    try {
        const result = await pool.query(consulta);
        return result;

    } catch (error) {

        console.log(error.code);
        return error;
    }
};
const consultar = async () => {

    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result.rows;
    } catch (error) {

        console.log(error.code);
        return error;
    }
};
const editar = async (datos) => {

    const consulta = {
        text: `UPDATE usuarios SET
    nombre = $1,
    balance = $2,
    WHERE nombre = $1 RETURNING *`,
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const eliminar = async (nombre) => {
    
    try {
    const result = await pool.query(
    `DELETE FROM usuarios WHERE nombre = '${nombre}'`
    );
    return result;
    } catch (error) {
    console.log(error.code);
    return error;
    }
}



module.exports = {insertar, consultar, editar, eliminar};