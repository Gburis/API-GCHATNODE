const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const morgan = require('morgan');
const cors =  require('cors');
const bytes = require('bytes');
require('colors');

const port = process.env.PORT || config.port;

const app = express();

// Conexão com o banco de dados MongoDB
mongoose.connect(config.mongodb)
    .then(() => console.log('Conexão com o banco de dados realizada com sucesso!'));

app.use((req, res, next) => {
  const start = Date.now();

  // Interceptando o método send da resposta para calcular o tamanho da resposta
  const originalSend = res.send;
  res.send = function(data) {
    const end = Date.now();
    const duration = end - start;
    
    // Calcular o tamanho da resposta em bytes
    const resSizeBytes = Buffer.byteLength(data, 'utf8');
    
    // Converter o tamanho da resposta para KB ou MB
    const resSizeKB = bytes(resSizeBytes, { unit: 'KB' });
    const resSizeMB = bytes(resSizeBytes, { unit: 'MB' });

    // Formatar a mensagem de log
    const logMessage = `${new Date().toISOString()} - RESPONSE: ${req.method} ${req.url} - ${res.statusCode} Size: ${resSizeKB} (${resSizeMB}) - Duration: ${duration}ms`;

    // Registrar a mensagem de log
    console.log(logMessage);

    // Chamar a função original send para enviar a resposta
    originalSend.apply(res, arguments);
  };

  // Chamar o próximo middleware na cadeia
  next();
});

app.use(morgan('dev'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token'], 
}));

app.use(express.json());

app.get('/online', (_, res) => res.send('Online'));

const api = require('./rules')(express); 
app.use('/api', api);

app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando na Porta: ${port}`);
});