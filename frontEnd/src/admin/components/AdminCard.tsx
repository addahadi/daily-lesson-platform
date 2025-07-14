import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lesson, Module } from '@/lib/adminType'
import { Edit, GripVertical, Trash2 } from 'lucide-react'
import React from 'react'
import {  useNavigate } from 'react-router-dom'


type AdminCardProps = {
    id: string | undefined
    title: string
    URL: string
    handleEditModule: () => void
    handleDeleteModule: () => void
    State : Module | Lesson
    children: React.ReactNode

}
const AdminCard = ({
    id,
    title,
    URL,
    State,
    handleEditModule,
    handleDeleteModule,
    children,
} : AdminCardProps) => {

  const navigate = useNavigate()
  return (
     <Card key={id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400">
              <GripVertical className="w-4 h-4" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            
            <Button 
            onClick={() => navigate(URL , {
              state: { State }
            })}
            
            variant="outline" size="sm">
              Manage Lessons
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEditModule()}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteModule()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export default AdminCard