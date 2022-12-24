import { NotFoundException } from "~/utils/exceptions";
import { Router } from "express";
import { SourcesService } from "~/resources/sources/sources.service";

/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const SourcesController = Router();

/**
 * Instance de notre service
 */
const service = new SourcesService();

/**
 * Trouve tous les animaux
 */
SourcesController.get("/", (req, res) => {
  return res.status(200).json(service.findAll());
});

/**
 * Trouve un animal en particulier
 */
SourcesController.get("/:id", (req, res) => {
  const id = req.params.id;
  const source = service.findOne(id);

  if (!source) {
    throw new NotFoundException("Source introuvable");
  }

  return res.status(200).json(source);
});

/**
 * Créé une source
 */
SourcesController.post("/", (req, res) => {
  const createdSource = service.create(req.body);

  return res.status(201).json(createdSource);
});

/**
 * Mise à jour d'une mixtape
 */
SourcesController.patch("/:id", (req, res) => {
  const id = req.params.id;
  const updatedSource = service.update(req.body, id);

  return res.status(200).json(updatedSource);
});

/**
 * Suppression d'une source
 */
SourcesController.delete("/:id", (req, res) => {
  const id = req.params.id;

  return res.status(200).json(service.delete(id));
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { SourcesController };
