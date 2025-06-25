
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
      <div className=" overflow-auto text-gray-500">{text}</div>
      <div>
        {heading === "Summary" && (
          <button
            
            className="w-full lg:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}

export default LessonText