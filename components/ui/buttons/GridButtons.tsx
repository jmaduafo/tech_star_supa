import React from 'react'
import { Button } from '../button'
import { LayoutGrid, List } from 'lucide-react'
import { changeView } from '@/utils/localView'

function GridButtons({ setView, view }: {
    readonly setView: React.Dispatch<React.SetStateAction<string>>;
    readonly view: string;
}) {
  return (
    <div className="flex gap-1">
          <Button
            title="grid view"
            variant="outline"
            onClick={() => setView(changeView(view))}
            className={`${
              view === "grid" ? "bg-lightText" : ""
            }`}
          >
            <LayoutGrid />
          </Button>
          <Button
            title="list view"
            variant="outline"
            onClick={() => setView(changeView(view))}
            className={`${
              view === "list" ? "bg-lightText" : ""
            }`}
          >
            <List />
          </Button>
        </div>
  )
}

export default GridButtons