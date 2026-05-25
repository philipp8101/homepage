import Rcon from "rcon";

import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";

const logger = createLogger("credentialedProxyHandler");

function basicAuthHeader(widget) {
  return `Basic ${Buffer.from(`${widget.username}:${widget.password}`).toString("base64")}`;
}

export default async function rconProxyHandler(req, res, map) {
  const { group, service, endpoint, index } = req.query;

  if (group && service) {
    const widget = await getServiceWidget(group, service, index);

    if (!widget) {
      logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
      return res.status(400).json({ error: "Invalid proxy service type" });
    }

    if (widget) {
      const conn = new Rcon(widget.url, widget.port, widget.password, {
        tcp: widget.tcp ?? true,
        challenge: widget.challenge ?? false,
      });

      var resultData = await new Promise((res, rej) => {
        conn.on("auth", () => {
          logger.debug("rcon: auth complete");
          conn.send(endpoint);
        });
        conn.on("response", (str) => {
          logger.debug("rcon: response: ", str);
          res(str);
        });
        conn.on("end", () => {
          logger.debug("rcon: connection closed");
          rej();
        });
        conn.on("error", (str) => {
          logger.debug("rcon: error: ", str);
          rej(str);
        });

        conn.connect();
      });

      // need to stringify the resultData,
      // because it will eventually be JSON.parse'd before being passed to the component
      return res.status(200).send(JSON.stringify(resultData));
    }
  }

  logger.debug("Invalid or missing proxy service type '%s' in group '%s'", service, group);
  return res.status(400).json({ error: "Invalid proxy service type" });
}
