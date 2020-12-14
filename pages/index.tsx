import Stations, { getStaticProps as getStations } from "./stations/index";

export default function Home({
  stationCodes = [],
}: {
  stationCodes: string[];
}) {
  return <Stations stationCodes={stationCodes} />;
}

export async function getStaticProps() {
  return await getStations();
}
