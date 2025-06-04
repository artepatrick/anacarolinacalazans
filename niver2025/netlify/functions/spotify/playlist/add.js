import { addTrackToPlaylist } from "../../../../spotify-service.js";

export default async (req, res) => {
  try {
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: "Missing trackId in request body" });
    }
    const result = await addTrackToPlaylist(trackId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
