const express = require('express')

const { Router } = express   
const infoRouter = Router()

const parseArgs = require('minimist')(process.argv)

infoRouter.get('/', async (req, res) => {
 
  let table = '<table border="1">'
  table += '<tr><th>Descripcion</th><th>Valor</th></tr>'
  for (const key in parseArgs) { if (key !== '_') { tabla += `<tr><td>Argumento</td><td>${key}: ${parseArgs[key]}</td></tr>` } }
  table += `<tr><td>Sistema operativo</td><td>${process.platform}</td></tr>`
  table += `<tr><td>Version de node.js</td><td>${process.versions.node}</td></tr>`
  table += `<tr><td>Memoria reservada</td><td>${(process.memoryUsage().heapTotal / (1024 * 1024 )).toFixed(2)} MB</td></tr>`
  table += `<tr><td>Process id</td><td>${process.pid}</td></tr>`
  table += `<tr><td>Path de ejecucion</td><td>${parseArgs._[2]}</td></tr>`
  table += `<tr><td>Carpeta del proyecto</td><td>${parseArgs._[1]}</td></tr>`
  table += '</table>'

  res.send(table)
})


module.exports = infoRouter