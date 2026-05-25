---
title: Factorio
description: Factorio Widget Configuration
---

Learn more about [Factorio](https://www.factorio.com/).

Use a Factorio Server's RCON port to query information about your running game
Requires the server to have RCON setup with a password [wiki](https://wiki.factorio.com/Command_line_parameters)

Allowed fields: `["players", "time"]`.
`"evolution"` can't be configured through allowed fields as it generates a field for each world

```yaml
widget:
  type: factorio
  url: https://factorio.host.or.ip
  port: "27015"
  password: "yourpassword"
```
