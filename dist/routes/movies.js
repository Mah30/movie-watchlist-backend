"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const express = require('express');
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//  Listar todos os filmes (GET /api/movies)
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield prisma.movie.findMany();
        console.log("Retrieved movies ->", movies);
        res.status(200).json(movies);
    }
    catch (error) {
        console.error("Error while retrieving movies ->", error);
        next(error);
    }
}));
// -  (GET /api/movies/:movieId) - Obtem um filme específico por ID
router.get("/:movieId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const movieIdNumber = Number(movieId);
    if (isNaN(movieIdNumber)) {
        return res.status(400).json({ message: "Invalid Movie ID" });
    }
    try {
        const movie = yield prisma.movie.findUnique({ where: { id: movieIdNumber } });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    }
    catch (error) {
        console.error("Error retrieving movie ->", error);
        next(error);
    }
}));
// - Criar um novo filme (POST /api/movies)
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, genre, status, rating } = req.body;
        const createdMovie = yield prisma.movie.create({
            data: { title, genre, status, rating },
        });
        console.log("Movie added ->", createdMovie);
        res.status(201).json(createdMovie);
    }
    catch (error) {
        console.error("Error while creating the movie ->", error);
        next(error);
    }
}));
// - Atualizar um filme (PUT /api/movies/:movieId)
router.put("/:movieId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const movieIdNumber = Number(movieId);
    if (isNaN(movieIdNumber)) {
        return res.status(400).json({ message: "Invalid Movie ID" });
    }
    try {
        const { title, genre, status, rating } = req.body;
        const updatedMovie = yield prisma.movie.update({
            where: { id: movieIdNumber },
            data: { title, genre, status, rating },
        });
        res.status(200).json(updatedMovie);
    }
    catch (error) {
        console.log("Error updating movie ->", error);
        next(error);
    }
}));
// - Obter todos os filmes com um determinado status (GET /api/movies/status/:status)
router.get("/status/:status", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    if (status !== "To Watch" && status !== "Watched") {
        return res.status(400).json({ message: "Invalid status. Use 'To Watch' or 'Watched'." });
    }
    try {
        const movies = yield prisma.movie.findMany({ where: { status } });
        if (!movies.length) {
            return res.status(404).json({ message: "No movies found with this status" });
        }
        res.status(200).json(movies);
    }
    catch (error) {
        console.error("Error retrieving movies by status ->", error);
        next(error);
    }
}));
// - Deletar um filme (DELETE /api/movies/:movieId)
router.delete("/:movieId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const movieIdNumber = Number(movieId);
    if (isNaN(movieIdNumber)) {
        return res.status(400).json({ message: "Invalid Movie ID" });
    }
    try {
        const deletedMovie = yield prisma.movie.delete({ where: { id: movieIdNumber } });
        res.status(200).json({ message: `Movie with ID ${deletedMovie.id} was deleted successfully` });
    }
    catch (error) {
        console.log("Error deleting movie ->", error);
        next(error);
    }
}));
exports.default = router;
