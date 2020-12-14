import axios from "axios";
import { useEffect, useState } from "react";
import { Station } from "../../components/station";
import HorizontalBarChart from "../../components/barchart";
import { useRouter } from "next/router";
import { Search } from "../../components/search";
import Head from "next/head";

export const getTemperature = (response) => {
  const data = response.data
    ?.split("\n")[1]
    ?.split(" ")
    ?.filter((item: string) => /M?\d+\/M?\d+/.test(item));
  const tempAndDew = data.length ? data[0] : "0/0";
  const currentTemp = tempAndDew.split("/")[0].replace("M", "-");
  return Number(currentTemp);
};

export default function Stations({
  stationCodes = [],
}: {
  stationCodes: string[];
}) {
  const [stations, setStations] = useState<Array<string>>([]);
  const [stationsDetails, setStationsDetails] = useState([]);
  const [stationDetailsLoading, setStationDetailsLoading] = useState(false);
  const [currentLastStation, setCurrentLastStation] = useState(29);
  const [searchOptions, setSearchOptions] = useState([]);

  const router = useRouter();

  const stationDetailsURL = process.env.NEXT_PUBLIC_STATION_DETAILS_URL;

  useEffect(() => {
    setStations(stationCodes.slice(0, 30));
    const getAllStationDetails = async () => {
      setStationDetailsLoading(true);
      try {
        let _stations = [];
        let promises = [];
        for (let i in stationCodes.slice(0, 30)) {
          promises.push(axios.get(`${stationDetailsURL}${stationCodes[i]}/`));
        }
        Promise.all(promises)
          .then((responses) => {
            let index = 0;
            responses.forEach((response) => {
              _stations.push({
                code: stationCodes[index],
                temperature: getTemperature(response),
              });
              index += 1;
            });
            return _stations;
          })
          .then((data) => {
            setStationsDetails(data);
            setStationDetailsLoading(false);
          });
      } catch (error) {
        console.error(error);
        setStationDetailsLoading(false);
      }
    };
    getAllStationDetails();
  }, []);

  const handleRemove = async (code: string) => {
    try {
      const response = await axios.get(
        `${stationDetailsURL}${stationCodes[currentLastStation + 1]}/`
      );

      setStationsDetails([
        ...stationsDetails.filter((station) => station.code !== code),
        {
          code: stationCodes[currentLastStation + 1],
          temperature: getTemperature(response),
        },
      ]);

      setStations([
        ...stations.filter((stationCode) => stationCode !== code),
        stationCodes[currentLastStation + 1],
      ]);
      setCurrentLastStation(currentLastStation + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setSearchOptions([]);
      return;
    }
    setSearchOptions(
      stationCodes
        .filter((code) => code.includes(event.target.value))
        .map((code) => ({
          value: code,
          label: code,
        }))
    );
  };

  const handleMenuSelect = (slug: string) => {
    router.push(`/stations/${slug}`);
  };

  return (
    <>
      <Head>
        <title>Metar - Stations</title>
      </Head>
      <div className="max-w-4xl mx-auto mt-12 px-8">
        <div className="flex my-8 justify-between">
          <h1 className="text-3xl mr-2">Stations</h1>
          <Search
            handleChange={handleChange}
            handleMenuSelect={handleMenuSelect}
            searchOptions={searchOptions}
          />
        </div>

        <div className="flex flex-wrap justify-between mx-auto">
          {stations.map((station) => (
            <Station key={station} code={station} handleRemove={handleRemove} />
          ))}
        </div>

        <div id="barchart" className="my-16">
          {stationDetailsLoading ? (
            <div className="text-center">
              Loading temperature visualization...
            </div>
          ) : (
            <HorizontalBarChart
              data={stationsDetails.map((station) => station.temperature)}
              labels={stations}
              heading="Temperature"
            />
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let stationCodes: string[];
  const stationsURL = process.env.NEXT_PUBLIC_STATIONS_URL;
  try {
    const response = await axios.get(stationsURL);
    stationCodes = response.data.codes;
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      stationCodes,
    },
  };
}
