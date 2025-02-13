import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedMovies() {
  const movies = [
    { title: "The Shawshank Redemption", genre: "Drama" },
    { title: "The Godfather", genre: "Crime" },
    { title: "The Dark Knight", genre: "Action" },
    { title: "Pulp Fiction", genre: "Crime" },
    { title: "Schindler's List", genre: "Biography" },
    { title: "Forrest Gump", genre: "Drama" },
    { title: "The Matrix", genre: "Sci-Fi" },
    { title: "Fight Club", genre: "Drama" },
    { title: "Superbad", genre: "Comedy" },
    { title: "Step Brothers", genre: "Comedy" },
    { title: "The Hangover", genre: "Comedy" },
    { title: "Dumb and Dumber", genre: "Comedy" },
    { title: "Anchorman: The Legend of Ron Burgundy", genre: "Comedy" },
    { title: "Ferris Bueller's Day Off", genre: "Comedy" },
    { title: "Groundhog Day", genre: "Comedy" },
    { title: "Monty Python and the Holy Grail", genre: "Comedy" },
    { title: "Mean Girls", genre: "Comedy" },
    { title: "The Big Lebowski", genre: "Comedy" },
    { title: "Shaun of the Dead", genre: "Comedy" },
    { title: "Bridesmaids", genre: "Comedy" },
    { title: "Deadpool", genre: "Comedy" },
    { title: "Tropic Thunder", genre: "Comedy" },
    { title: "Zombieland", genre: "Comedy" },
    { title: "Borat: Cultural Learnings of America", genre: "Comedy" },
    { title: "21 Jump Street", genre: "Comedy" },
    { title: "The Grand Budapest Hotel", genre: "Comedy" },
    { title: "Ghostbusters", genre: "Comedy" },
    { title: "Legally Blonde", genre: "Comedy" }
  ];

  for (const movie of movies) {
    await prisma.movie.create({ data: movie });
  }

  console.log(" Movies added successfully!");
}

seedMovies()
  .catch((error) => console.error(" Error seeding movies:", error))
  .finally(() => prisma.$disconnect());
