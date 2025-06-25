import React from 'react'

const LessonSummary = ({
  text,
  heading,
}: {
  text: string;
  heading: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-7 mb-7 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{heading}</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
        {text}
        </p>
        
        <button 
           
            className="w-full lg:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
            Mark as Completed
        </button>
        
    </div>
            
  )
};

export default LessonSummary