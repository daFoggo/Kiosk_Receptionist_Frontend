const EventBanner = ({ img }: { img: string }) => {
  return (
    <img
      src={img}
      alt=""
      className="bg-cover object-cover w-full h-auto rounded-md"
    />
  );
};

export default EventBanner;
