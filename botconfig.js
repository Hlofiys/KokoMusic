module.exports = {
  Admins: ["UserID", "UserID"],
  ExpressServer: true, //сайт
  DefaultPrefix: process.env.Prefix || "-",
  Port: 3000,
  SupportServer: "https://discord.gg/8A4QCCxus8",
  Token: process.env.Token || "",
  ClientID: process.env.Discord_ClientID || "",
  ClientSecret: process.env.Discord_ClientSecret || "",
  Scopes: ["identify", "guilds", "applications.commands"],
  ServerDeafen: true,
  DefaultVolume: 100,
  CallbackURL: "/api/callback",
  "24/7": false,
  CookieSecret: "Pikachu is cute",
  IconURL:
    "https://raw.githubusercontent.com/Hlofiys/KokoMusic/main/assets/logo.gif",
  EmbedColor: "RANDOM", 
  Permissions: 2205281600, 
  Website: process.env.Website || "https://bot.hlofiys.tk", //без / в конце
  
  Presence: {
    status: "online", //  online, idle, and dnd
    name: "-help", 
    type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
  },

  //Lavalink
  Lavalink: {
    id: "Main",
    host: "",
    port: 2333, 
    pass: "youshallnotpass",
    secure: false, 
  },

  //https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "",
    ClientSecret: process.env.Spotify_ClientSecret || "",
  },
};
