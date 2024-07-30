import Title from "../Title";
import { features } from "../../../constants/features";

const Features = () => {
  return (
    <section className="flex flex-col items-center gap-y-8 bg-gray-100 py-4">
      <Title>Features and Benefits</Title>

      <div className="flex flex-wrap w-[1200px] justify-between">
        {features.map((feature) => {
          return (
            <div
              className="flex flex-col sm:w-[380px] items-center justify-center shadow-xl gap-y-6 p-4 rounded-xl bg-white"
              key={feature.title}
            >
              <div className="p-1.5 bg-green-600 rounded-full flex items-center justify-center">
                <feature.Icon color="white" size={28} />
              </div>
              <div className="flex flex-col gap-x-4 items-center gap-y-4">
                <p className="md:text-xl font-medium text-center uppercase">
                  {feature.title}
                </p>
                <p className="leading-7 text-justify">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
