import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;
  const { data: playersData, error: playersError } = useWidgetAPI(widget, "players");
  const { data: timeData, error: timeError } = useWidgetAPI(widget, "time");
  const { data: evolutionData, error: evolutionError } = useWidgetAPI(widget, "evolution");

  if (playersError) {
    return <Container service={service} error={playersError} />;
  }
  if (timeError) {
    return <Container service={service} error={timeError} />;
  }
  if (evolutionError) {
    return <Container service={service} error={evolutionError} />;
  }

  if (!playersData || !timeData || !evolutionData) {
    return (
      <Container service={service}>
        <Block label="factorio.players" />
        <Block label="factorio.time" />
        <Block label="factorio.evolution" />
      </Container>
    );
  }

  const players = playersData
    .split("\n")
    .slice(1)
    .map((x) => {
      return {
        name: x.trim().split(" ")[0],
        online: x.includes("(online)"),
      };
    })
    .filter((x) => x.online).length;
  const timeArr = timeData
    .split(" ")
    .map((x) => parseInt(x))
    .filter((x) => Number.isInteger(x));
  const time = timeArr[0] * 60 * 60 + timeArr[1] * 60 + timeArr[2];
  const evolution = evolutionData
    .split("\n")
    .map((x) => {
      return {
        planet: x.split(" ")[0],
        evolution: x.split(" ")[4],
      };
    })
    .slice(0, 4);

  // FIXME multiple identical labels breaks fields visibility functionallity but when generating labels dynamically "factorio.evolution.${item.planet}" they will not work from the yaml config
  return (
    <Container service={service}>
      <Block label="factorio.players" value={players} />
      <Block label="factorio.time" value={t("common.duration", { value: time })} />
      {evolution.map((item) => (
        <Block label="factorio.evolution" value={`${item.planet}: ${item.evolution}`} />
      ))}
    </Container>
  );
}
