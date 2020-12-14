import "../styles/tailwind.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteComplete = (url) => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeError", () => NProgress.done());
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeStart", () => NProgress.start());
      router.events.off("routeChangeError", () => NProgress.done());
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
