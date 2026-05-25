import rconProxyHandler from "utils/proxy/handlers/rcon";

const widget = {
  proxyHandler: rconProxyHandler,
  fields: ["players", "time", "evolution"],

  mappings: {
    players: {
      endpoint: "/players",
    },
    time: {
      endpoint: "/time",
    },
    evolution: {
      endpoint: "/evolution",
    },
  },
};

export default widget;
