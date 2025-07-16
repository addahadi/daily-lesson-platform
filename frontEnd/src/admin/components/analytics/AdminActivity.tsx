import { Card, CardContent } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'

type AdminActivityProps = {
  Icon: React.ElementType;
  header: string;
  value: number;
  secondaryValue: string;
  percentage?: number;
};


const AdminActivity = ({
    Icon ,
    header , 
    value , 
    secondaryValue,
    percentage
} : AdminActivityProps) => {


  const isPositive = percentage !== undefined && percentage > 0;
  
  return (
    <Card className=' pt-5 hover:shadow-md'>
      <CardContent className=" flex flex-col gap-2">
        <div className=" w-full flex justify-between items-center">
          <h1 className=" font-semibold  text-gray-600">{header}</h1>
          <Icon className = " w-5 h-5"/>
        </div>
        <div className=" text-3xl w-full font-semibold text-gray-800 mb-2">
          {value}
        </div>
        <div className=" text-gray-400 ">
            {secondaryValue}
        </div>
        {percentage !== undefined && (
          <div
            className={` mt-2 flex flex-row gap-1 ${isPositive ? "text-green-500" : "text-red-500"} items-center `}>
            {
                isPositive
                ?<TrendingUp className=" w-3 h-3" />
                :<TrendingDown className=" w-3 h-3" />  
            }
                <span>{percentage}% from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminActivity