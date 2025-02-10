import { HomeCarousel } from "@/components/home/home-carousel";
import data from "@/lib/data";

export default async function Home() {
  return <HomeCarousel items={data.carousels} />;
}