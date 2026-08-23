import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get(
  "/api/videos/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = process.env.TWITCH_ACCESS_TOKEN;

    if (!clientId || !accessToken) {
      res
        .status(500)
        .json({ error: "Credenciais da Twitch ausentes no servidor." });
      return;
    }

    try {
      const twitchResponse = await fetch(
        `https://api.twitch.tv/helix/videos?id=${id}`,
        {
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!twitchResponse.ok) {
        res
          .status(twitchResponse.status)
          .json({ error: `Erro na Twitch API: ${twitchResponse.statusText}` });
        return;
      }

      const data = (await twitchResponse.json()) as unknown;
      res.json(data);
    } catch (error: unknown) {
      res
        .status(500)
        .json({ error: "Falha interna ao contatar a API da Twitch." });
    }
  },
);

app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
