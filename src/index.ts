import { ExceptionsHandler } from "~/middlewares/exceptions.handler";
import { MixtapesController } from "~/resources/mixtapes/mixtapes.controller";
import { UnknownRoutesHandler } from "~/middlewares/unknownRoutes.handler";
import { config } from "~/config";
import cors from "cors";
import express from "express";

/**
 * On créé une nouvelle "application" express
 */
const app = express();

/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(express.json());

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors());

/**
 * On donne accès à un dossier public
 */
app.use(express.static("public"));

/**
 * Toutes les routes CRUD pour les tracks seronts préfixées par `/tracks`
 */
app.use("/mixtapes", MixtapesController);

/**
 * Homepage (uniquement necessaire pour cette demo)
 */
app.get("/", (req, res) => res.send("Nina.fm MusicInfo API"));

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
app.all("*", UnknownRoutesHandler);

/**
 * Gestion des erreurs
 * /!\ Cela doit être le dernier `app.use`
 */
app.use(ExceptionsHandler);

/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(config.API_PORT, () => console.log("Silence, ça tourne."));
