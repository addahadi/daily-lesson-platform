import { BookOpen } from 'lucide-react'
import React from 'react'

const EmptySearch = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
          <div className="bg-orange-50 rounded-full p-8 mb-8">
            <BookOpen className="w-8 h-8 text-orange-500" />
          </div>
    
          <div className="text-center max-w-md mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              No courses Found
            </h2>
            <p className="text-gray-600 text-md leading-relaxed">
                it seem that your search return null statement , our database does not have such course
            </p>
          </div>
    </div>
  )
}

export default EmptySearch