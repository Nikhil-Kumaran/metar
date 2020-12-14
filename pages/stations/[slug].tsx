import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStaticProps as getStations } from "../index";

export default function StationDetailPage({ params }) {
  const [stationDetail, setStationDetail] = useState(null);
  const [stationDetailLoading, setStationDetailLoading] = useState(false);
  const { slug } = params;

  const stationDetailsURL = process.env.NEXT_PUBLIC_STATION_DETAILS_URL;

  const getStationDetail = async () => {
    try {
      setStationDetailLoading(true);
      const response = await axios.get(`${stationDetailsURL}${slug}/`);
      const data = response.data?.split("\n");
      setStationDetail({
        date: data[0],
        otherDetails: data[1].split(" "),
      });
      setStationDetailLoading(false);
    } catch (error) {
      console.log(error);
      setStationDetailLoading(false);
    }
  };

  useEffect(() => {
    getStationDetail();
  }, []);

  const handleRefresh = () => {
    getStationDetail();
  };

  return (
    <>
      <Head>
        <title>Metar - {slug}</title>
      </Head>
      <div className="max-w-4xl mx-auto mt-12 px-12">
        <Link href="/stations">
          <a className="hover:underline">← Back to stations</a>
        </Link>
        <div className="flex my-8 justify-between">
          <h1 className="text-3xl">{slug}</h1>
          <button
            onClick={handleRefresh}
            type="button"
            className="px-3 leading-8 rounded transition-all duration-200 bg-gray-200 hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>

        {stationDetailLoading || !stationDetail ? (
          <div>Loading station details...</div>
        ) : (
          <>
            <div className="mb-8">
              Date of the last observation -{" "}
              {new Date(stationDetail.date).toLocaleString("en-US", {
                weekday: "short",
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}{" "}
              {stationDetail.date.split(" ")[1]}
            </div>
            <div>
              <h2>Other details</h2>
              <div className="w-full overflow-auto py-4">
                {stationDetail.otherDetails.map((detail) => (
                  <span key={detail} className="mr-4">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const {
    props: { stationCodes },
  } = await getStations();
  const paths = stationCodes.map((code) => ({
    params: { slug: code },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { params } };
}
