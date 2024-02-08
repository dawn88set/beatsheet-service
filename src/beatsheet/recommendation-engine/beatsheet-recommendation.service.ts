import { Injectable } from "@nestjs/common";
import { Beat } from "../models/interfaces/beat";
import { Act } from "../models/interfaces/act";
import * as natural from "natural";

@Injectable()
export class BeatSheetRecommendationService {
  tfidf = new natural.TfIdf();

  constructor() {
    const suggestedAct = this.getSuggestedAct(
      [
        {
          id: "1",
          description: "Description of Act 1",
          cameraAngle: "",
          duration: 10,
          timestamp: new Date().toDateString()
        }, // 1: Performed, 0: Not performed
        {
          id: "5",
          description: "Description of Act 5",
          cameraAngle: "",
          duration: 10,
          timestamp: new Date().toDateString()
        },
        {
          id: "3",
          description: "Description of Act 3",
          cameraAngle: "",
          duration: 10,
          timestamp: new Date().toDateString()
        }
      ],
      [
        {
          id: "2",
          description: "Description of Act 2",
          cameraAngle: "",
          duration: 10,
          timestamp: new Date().toDateString()
        },
        {
          id: "4",
          description: "Description of Act 4",
          cameraAngle: "",
          duration: 10,
          timestamp: new Date().toDateString()
        }
      ]
    );
    console.log("suggestedAct", suggestedAct);
  }

  // Function to calculate cosine similarity
  calculateCosineSimilarity(doc1: string, doc2: string): number {
    const vec1 = this.tfidf.tfidfs(doc1);
    const vec2 = this.tfidf.tfidfs(doc2);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] ** 2;
      magnitude2 += vec2[i] ** 2;
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    return dotProduct / (magnitude1 * magnitude2);
  }

  getSuggestedBeat(performedBeats: Beat[], unperformedBeats: Beat[]) {
    if (unperformedBeats.length === 0) {
      return null; // No more acts to recommend
    }

    // Calculate average cosine similarity of performed acts with unperformed acts
    const avgSimilarity: Record<string, number> = {};

    performedBeats.forEach((performedBeat) => {
      unperformedBeats.forEach((unperformedBeat) => {
        if (!avgSimilarity[unperformedBeat.id]) {
          avgSimilarity[unperformedBeat.id] = 0;
        }

        avgSimilarity[unperformedBeat.id] += this.calculateCosineSimilarity(
          performedBeat.description,
          unperformedBeat.description
        );
      });
    });

    Object.keys(avgSimilarity).forEach((act) => {
      avgSimilarity[act] /= performedBeats.length;
    });

    // Get act with highest average similarity
    const nextAct = Object.keys(avgSimilarity).reduce((a, b) => (avgSimilarity[a] > avgSimilarity[b] ? a : b));

    return nextAct;
  }

  getSuggestedAct(performedActs: Act[], unperformedActs: Act[]) {
    if (unperformedActs.length === 0) {
      return null; // No more acts to recommend
    }

    // Calculate average cosine similarity of performed acts with unperformed acts
    const avgSimilarity: Record<string, number> = {};

    performedActs.forEach((performedAct) => {
      unperformedActs.forEach((unperformedAct) => {
        if (!avgSimilarity[unperformedAct.id]) {
          avgSimilarity[unperformedAct.id] = 0;
        }

        avgSimilarity[unperformedAct.id] += this.calculateCosineSimilarity(
          performedAct.description,
          unperformedAct.description
        );
      });
    });

    Object.keys(avgSimilarity).forEach((act) => {
      avgSimilarity[act] /= performedActs.length;
    });

    // Get act with highest average similarity
    const nextAct = Object.keys(avgSimilarity).reduce((a, b) => (avgSimilarity[a] > avgSimilarity[b] ? a : b));

    return nextAct;
  }
}
