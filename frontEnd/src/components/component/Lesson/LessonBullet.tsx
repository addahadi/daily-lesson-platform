
const LessonBullet = ({
    heading,
    bullets
} : {
    heading : string 
    bullets : string[]
}) => {
  return (
    <div className="bg-white-1 flex flex-col p-5 rounded-lg gap-3 mt-5 mb-5">
      <h1>
        <span className=" text-black-1 text-xl">{heading}</span>
      </h1>
      <div className=" overflow-auto text-gray-500">
        {
            bullets.map((bullet , index) => {
                return (
                <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-1 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{bullet}</span>
                </li>
                )

            })
        }
      </div>
    </div>
  );
}

export default LessonBullet