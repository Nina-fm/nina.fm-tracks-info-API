import { BadRequestException, NotFoundException } from "~/utils/exceptions";

import { Router } from "express";
import { TracksService } from "~/resources/tracks/tracks.service";

/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const TracksController = Router();

/**
 * Instance de notre service
 */
const service = new TracksService();

/**
 * Trouve tous les animaux
 */
TracksController.get("/", (req, res) => {
  return res.status(200).json(service.findAll());
});

/**
 * Trouve un animal en particulier
 */
TracksController.get("/:id", (req, res) => {
  const id = req.params.id;
  const track = service.findOne(id);

  if (!track) {
    throw new NotFoundException("Track introuvable");
  }

  return res.status(200).json(track);
});

/**
 * Créé une track
 */
TracksController.post("/", (req, res) => {
  const createdTrack = service.create(req.body);

  return res.status(201).json(createdTrack);
});

/**
 * Mise à jour d'une mixtape
 */
TracksController.patch("/:id", (req, res) => {
  const id = req.params.id;
  const updatedTrack = service.update(req.body, id);

  return res.status(200).json(updatedTrack);
});

/**
 * Suppression d'une track
 */
TracksController.delete("/:id", (req, res) => {
  const id = req.params.id;

  return res.status(200).json(service.delete(id));
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { TracksController };
