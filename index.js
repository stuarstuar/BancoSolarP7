// Paquetes

const http = require("http");
const url = require("url");
const fs = require("fs");
const { insertar, consultar, editar, eliminar, transferir} = require("./consultas");

// Servidor y rutas

http
    .createServer(async (req, res) => {


        if (req.url == "/" && req.method === "GET") {
            res.setHeader("content-type", "text/html");
            const html = fs.readFileSync("index.html", "utf8");
            res.end(html);
        }

        // URLs de usuarios

        if ((req.url == "/usuario" && req.method == "POST")) {

            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {

                const datos = Object.values(JSON.parse(body));
                const respuesta = await insertar(datos);
                res.end(JSON.stringify(respuesta));
                
            });
        }

        if (req.url == "/usuario" && req.method === "GET") {

            const registros = await consultar();
            //console.log(registros)
            res.end(JSON.stringify(registros));
        }
        // No se puede editar pq no le hice el id
        if (req.url == "/usuario" && req.method == "PUT") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
                console.log(body)
            });
            req.on("end", async () => 
            {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await editar(datos);
                res.end(JSON.stringify(respuesta));
                res.end("hola")
            });
        }

        if (req.url.startsWith("/usuario") && req.method == "DELETE") {

            const {nombre} = url.parse(req.url, true).query;
            const respuesta = await eliminar(nombre);
            res.end(JSON.stringify(respuesta));
        }

        // URLs de transferencias

        // Hace la transferencia, pero falta cerrarla
        if ((req.url == "/transferencia" && req.method == "POST")) {

            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", async () => {

                const datos = Object.values(JSON.parse(body));
                console.log(datos)
                const res = await transferir(datos);
                res.end(JSON.stringify(res));
                //res.end(console.log("Transferencia Hecha"))
            });
        }









    })
    .listen(3000);