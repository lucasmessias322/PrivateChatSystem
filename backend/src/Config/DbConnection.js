import mongoose from "mongoose";

const dbUser = process.env.DBUserName;
const dbPassorwd = process.env.DBPassword;
const dataBaseName = process.env.DataBaseName;
const mongodbUrl = `mongodb+srv://${dbUser}:${dbPassorwd}@cluster0.ux9cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  mongoose
    .connect(mongodbUrl, {})
    .then((e) => {
      console.log("Conexão com MongoDB realizada com sucesso!");
    })
    .catch((erro) => {
      console.log("Erro: Conexão com MongoDB não foi realizada com sucesso!");
      console.log(erro);
    });
};

export default connectDB;
