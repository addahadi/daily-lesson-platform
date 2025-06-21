
const LessonText = ({
    text , heading
}: {
    text : string 
    heading : string
}) => {
  return (
    <div className="bg-white-1 flex flex-col p-5 rounded-lg gap-3 mt-5 mb-5">
      <h1>
        <span className=" text-black-1 text-xl">{heading}</span>
      </h1>
      <div className=" overflow-auto text-gray-500">
            {text}
      </div>
    </div>
  );
}

export default LessonText