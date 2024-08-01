import Features from "@/components/Home/Features";
import Navbar from "@/components/Home/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main className="flex h-[85vh] justify-between items-center px-20">
        <div className="flex flex-col gap-y-6 w-[50%]">
          <h1 className="text-5xl font-bold text-center xl:text-left">
            Manage your projects easily
          </h1>
          <p className="leading-7 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            blanditiis nihil repellendus dolores, a dolorum! Nemo aliquid,
            voluptatem, recusandae, deserunt consequatur mollitia rerum
            reprehenderit quam repellendus fugiat facilis. Fuga dolorum ipsa,
            aliquid eveniet iste laboriosam blanditiis veritatis minima,
            necessitatibus est laudantium, facere distinctio assumenda hic
            aliquam ratione soluta consequatur adipisci!
          </p>
          <Button className="w-fit" asChild>
            <Link to={"/signup"}>Try for free</Link>
          </Button>
        </div>

        <img
          src="./home.jpg"
          alt="Hero Image"
          className="w-[600px] rounded-lg"
        />
      </main>

      <Features />
    </>
  );
};

export default HomePage;
