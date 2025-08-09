import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const BackTo = ({
    URL,
    title
} : {
    URL : string
    title : string
}) => {
  return (
    <div className="mb-6">
        <Link
            to={URL}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
            <ArrowLeft className="w-4 h-4" />
            {title}
        </Link>
    </div>
  )
}

export default BackTo