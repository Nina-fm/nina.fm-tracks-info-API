import { NotFoundException } from "~/utils/exceptions";
import type { Source } from "~~/types/sources";
import data from "~~/data/data.json";
import dotenv from "dotenv";
import uniqid from "uniqid";

dotenv.config();

const getPublicUrl = (file: string) => `${process.env.BASE_URL}/covers/${file}`;

export class SourcesService {
  /**
   * On copie localement les sources pour pouvoir insérer, supprimer etc
   */
  sources: Source[] = data;

  /**
   * Trouve toutes les sources
   */
  findAll(): Source[] {
    return this.sources.map((source) => ({
      ...source,
      coverUrl: getPublicUrl(source.cover),
    }));
  }

  /**
   * Trouver une source
   * @param id - ID unique de la source
   */
  findOne(id: string): Source | undefined {
    const source = this.sources.find((source) => source.id === id);
    return source
      ? {
          ...source,
          coverUrl: getPublicUrl(source?.cover),
        }
      : undefined;
  }

  /**
   * Mise à jour d'une source
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param petData - Un objet correspondant à une source, il ne contient pas forcément tout une source. Attention, on ne prend pas l'id avec.
   * @param id - ID unique de la source
   */
  update(sourceData: Partial<Source>, id: string): Source | undefined {
    const index = this.sources.findIndex((source) => source.id === id);

    if (index === -1) {
      throw new NotFoundException("Source introuvable");
    }

    /* On ne met jamais l'id à jour */
    delete sourceData.id;

    this.sources[index] = { ...this.sources[index], ...sourceData };
    return this.sources[index];
  }

  /**
   * Création d'une source
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param sourceData - Un objet correspondant à une source. Attention, on ne prend pas l'id avec.
   */
  create(sourceData: Omit<Source, "id">): Source {
    const newSource: Source = {
      ...sourceData,
      id: uniqid(),
    };

    this.sources.push(newSource);
    return newSource;
  }

  /**
   * Suppression d'une source
   */
  delete(id: string) {
    this.sources = this.sources.filter((source) => source.id !== id);
  }
}
