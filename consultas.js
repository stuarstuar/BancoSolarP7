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

const transferir = async(datos) =>{
    const fecha = new Date()

    pool.connect(async (error_conexion, client, release) => {

        if (error_conexion) return console.error(error_conexion)
    
        try {
        await client.query("BEGIN");
        
        const descontar = `UPDATE usuarios SET balance = balance - ${datos[2]} WHERE nombre ='${datos[0]}' RETURNING * `;
        descuento = await client.query(descontar);

        const acreditar = `UPDATE usuarios SET balance = balance + ${datos[2]} WHERE nombre ='${datos[1]}' RETURNING *`;
        acreditacion = await client.query(acreditar);
    
        console.log("Descuento realizado con éxito: ", descuento.rows[0]);
        console.log("Acreditación realizada con éxito: ", acreditacion.rows[0]);
    
        await client.query("COMMIT")


        }catch(e){
    
            await client.query("ROLLBACK");
            console.log("Error código: " + e.code);
            console.log("Detalle del error: " + e.detail)
            console.log("Tabla originaria del error: " + e.table); 
            console.log("Restricción violada en el campo: " + e.constraint);
        }
        
        release();
        pool.end();
    });
         
}





module.exports = {insertar, consultar, editar, eliminar, transferir};