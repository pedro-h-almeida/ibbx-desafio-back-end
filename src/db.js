const mongoose = require ("mongoose")

let conn = null;

module.exports = connectDatabase = async () => {
  if (conn === null){
    console.log("Criando uma conexão com o banco de dados....");
    conn = await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000,
    });
    return conn;
  }

  console.log("Reutilizando conexão já existente!");
};
