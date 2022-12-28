import { Exception, NotFoundException } from "~/utils/exceptions";

import { MixtapesService } from "~/resources/mixtapes/mixtapes.service";
import { Router } from "express";
import fs from "fs";

const mixtapesFile = `../../data/data.json`;

/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const MixtapesController = Router();

/**
 * Instance de notre service
 */
const service = new MixtapesService();

/**
 * Sauvegarde les data dans le fichier JSON
 * @param data
 */
const saveData = (data: unknown) => {
  fs.writeFileSync(`./data/data.json`, JSON.stringify(service.mixtapes));
};

/**
 * Trouve tous les mixtapes
 */
MixtapesController.get("/", (req, res) => {
  return res.status(200).json(service.findAll());
});

/**
 * Trouve une mixtape en particulier
 */
MixtapesController.get("/:id", (req, res) => {
  const id = req.params.id;
  const mixtape = service.findOne(id);

  if (!mixtape) {
    throw new NotFoundException("Mixtape introuvable");
  }

  return res.status(200).json(mixtape);
});

/**
 * Créé une mixtape
 */
MixtapesController.post("/", (req, res) => {
  try {
    const createdMixtape = service.create(req.body);
    saveData(service.mixtapes);
    return res.status(201).json(createdMixtape);
  } catch (error) {
    throw error;
  }
});

/**
 * Mise à jour d'une mixtape
 */
MixtapesController.patch("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updatedMixtape = service.update(req.body, id);
    saveData(service.mixtapes);
    return res.status(200).json(updatedMixtape);
  } catch (error) {
    throw error;
  }
});

/**
 * Suppression d'une mixtape
 */
MixtapesController.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const result = service.delete(id);
    saveData(service.mixtapes);
    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { MixtapesController };
