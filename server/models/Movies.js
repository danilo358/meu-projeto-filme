const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true }, // ID do filme na API do TMDB
  title: { type: String, required: true }, // Título do filme
  poster_path: { type: String }, // URL do pôster do filme
  release_date: { type: String }, // Data de lançamento
  vote_average: { type: Number }, // Nota média do filme
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Relacionamento com o usuário
  watched: { type: Boolean, default: false } // Se o filme foi assistido ou não
});

module.exports = mongoose.model("Movie", MovieSchema);
