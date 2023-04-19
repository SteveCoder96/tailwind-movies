import { fetchMovieInfo } from "@/hooks/useMovieInfo";
import { Suspense } from "react";
import Loader from "@/components/loader";
import Carrousel from "@/components/carrousel";
import MovieInfo from "@/components/movie/movie-info";
import { getMovieRecomendations } from "@/hooks/useGetRecomendations";
import Text from "@/components/ui/typography";
import Movie from "@/components/movie";
import { IconMoodSadFilled } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page({
  params,
}: {
  params: {
    movie: string;
  };
}) {
  const movieInfo = await fetchMovieInfo(Number(params.movie));
  const images = movieInfo?.images?.posters.slice(0, 8);
  const movieRecommendations = await getMovieRecomendations(
    Number(params.movie)
  );
  const userId = await getServerSession(authOptions);

  return (
    <div className="border min-h-screen grid lg:grid-cols-2  lg:gap-x-2">
      <Suspense fallback={<Loader />}>
        <Carrousel images={images} />
        {/* <MovieInfo userId={userId?.user?.id as string} {...movieInfo} /> */}
      </Suspense>
      {/* <Suspense fallback={<Loader />}>
        <MovieInfo userId={userId?.user?.id as string} {...movieInfo} />
      </Suspense> */}
      <div className="lg:col-span-2 text-white mt-3 px-4 py-2">
        <Text size="h2" className="my-4 text-4xl  text-black dark:text-white">
          Recommendations
        </Text>
        <div className="grid lg:grid-cols-4 gap-3">
          {movieRecommendations.length ? (
            <>
              {movieRecommendations.map((movie) => (
                <Movie key={movie.id} tvShows={false} {...movie} />
              ))}
            </>
          ) : (
            <Text
              size="h1"
              className="py-4 text-center col-span-full flex flex-col items-center justify-center text-black dark:text-white"
            >
              NO MOVIES FOUND
              <IconMoodSadFilled className="dark:text-red-50 text-black" />
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
