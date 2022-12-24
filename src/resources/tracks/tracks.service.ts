import { NotFoundException } from "~/utils/exceptions";
import type { Track } from "~~/types/tracks";
import data from "~~/data/data.json";
import dotenv from "dotenv";
import uniqid from "uniqid";

dotenv.config();

export class TracksService {
  /**
   * On copie localement les tracks pour pouvoir insérer, supprimer etc
   */
  tracks: Track[] = data.map((track) => ({
    ...track,
    cover: `${process.env.BASE_URL}/covers/${track.cover}`,
  }));

  /**
   * Trouve toutes les tracks
   */
  findAll(): Track[] {
    return this.tracks;
  }

  /**
   * Trouve une track en particulier
   * @param id - ID unique de la track
   */
  findOne(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  /**
   * Met à jour une track en particulier
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param petData - Un objet correspondant à une track, il ne contient pas forcément tout une track. Attention, on ne prend pas l'id avec.
   * @param id - ID unique de la track
   */
  update(trackData: Partial<Track>, id: string): Track | undefined {
    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      throw new NotFoundException("Track introuvable");
    }

    /* On ne met jamais l'id à jour */
    delete trackData.id;

    this.tracks[index] = { ...this.tracks[index], ...trackData };
    return this.tracks[index];
  }

  /**
   * Créé une track
   *
   * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
   *
   * @param trackData - Un objet correspondant à une track. Attention, on ne prend pas l'id avec.
   */
  create(trackData: Omit<Track, "id">): Track {
    const newTrack: Track = {
      ...trackData,
      id: uniqid(),
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  /**
   * Suppression d'une track
   */
  delete(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
