import { Card, CardContent } from "@repo/ui/components/ui/card.tsx"
import { FileX2 } from 'lucide-react'

interface NoDataProps {
  dataType?: string
}

export default function NoData({ dataType = "data" }: NoDataProps) {
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <FileX2 className="h-10 w-10 mb-4" />
        <h3 className="text-lg font-semibold mb-1">No hay {dataType} disponibles</h3>
        <p className="text-sm">
          Actualmente no hay {dataType.toLowerCase()} para mostrar.
        </p>
      </CardContent>
    </Card>
  )
}