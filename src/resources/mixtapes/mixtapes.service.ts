import { Exception, NotFoundException } from "~/utils/exceptions";

import type { Mixtape } from "~~/types/mixtapes";
import data from "~~/data/data.json";
import dotenv from "dotenv";
import uniqid from "uniqid";

dotenv.config();

const getPublicUrl = (file: string) => `${process.env.URL}/covers/${file}`;

export class MixtapesService {
  /**
   * On copie localement les mixtapes pour pouvoir insérer, supprimer etc
   */
  mixtapes: Mixtape[] = data;

  exists(mixtape: Mixtape): boolean {
    return (
      this.mixtapes.filter(
        (m) => m.author === mixtape.author && m.name === mixtape.name
      ).length > 0
    );
  }

  /**
   * Trouve toutes les mixtapes
   */
  findAll(): Mixtape[] {
    return this.mixtapes.map((mixtape) => ({
      ...mixtape,
      ...(mixtape.cover ? { coverUrl: getPublicUrl(mixtape.cover) } : {}),
    }));
  }

  /**
   * Trouver une mixtape
   * @param id - ID unique de la mixtape
   */
  findOne(id: string): Mixtape | undefined {
    const mixtape = this.mixtapes.find((mixtape) => mixtape.id === id);
    return mixtape
      ? {
          ...mixtape,
          ...(mixtape.cover ? { coverUrl: getPublicUrl(mixtape.cover) } : {}),
        }
      : undefined;
  }

  /**
   * Création d'une mixtape
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param mixtapeData - Un objet correspondant à une mixtape. Attention, on ne prend pas l'id avec.
   */
  create(mixtapeData: Omit<Mixtape, "id">): Mixtape {
    const newMixtape: Mixtape = {
      ...mixtapeData,
      id: uniqid(),
    };

    if (!this.exists(newMixtape)) {
      this.mixtapes.push(newMixtape);
      return newMixtape;
    }

    throw new Exception("Mixtape already exists", 409);
  }

  /**
   * Mise à jour d'une mixtape
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param petData - Un objet correspondant à une mixtape, il ne contient pas forcément tout une mixtape. Attention, on ne prend pas l'id avec.
   * @param id - ID unique de la mixtape
   */
  update(mixtapeData: Partial<Mixtape>, id: string): Mixtape | undefined {
    const index = this.mixtapes.findIndex((mixtape) => mixtape.id === id);

    if (index === -1) {
      throw new NotFoundException("Mixtape introuvable");
    }

    /* On ne met jamais l'id à jour */
    delete mixtapeData.id;

    this.mixtapes[index] = { ...this.mixtapes[index], ...mixtapeData };
    return this.mixtapes[index];
  }

  /**
   * Suppression d'une mixtape
   */
  delete(id: string) {
    this.mixtapes = this.mixtapes.filter((mixtape) => mixtape.id !== id);
  }
}
