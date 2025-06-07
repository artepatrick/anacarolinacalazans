import { searchTracks } from "../../../spotify-service.js";

export default async (req, res) => {
  try {
    const query = req.query.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }
    const tracks = await searchTracks(query, limit);
    res.status(200).json({ tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
