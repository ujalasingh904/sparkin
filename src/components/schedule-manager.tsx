"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Minus, Save } from "lucide-react"

interface TimeSlot {
  id: string
  start: number
  end: number
}

interface DaySchedule {
  enabled: boolean
  slots: TimeSlot[]
}

export default function ScheduleManager() {
  const [scheduleName, setScheduleName] = useState("Weekend off")
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Sunday: { enabled: false, slots: [] },
    Monday: { enabled: true, slots: [{ id: "1", start: 8, end: 20 }] },
    Tuesday: { enabled: true, slots: [{ id: "2", start: 8, end: 20 }] },
    Wednesday: { enabled: true, slots: [{ id: "3", start: 8, end: 20 }] },
    Thursday: { enabled: true, slots: [{ id: "4", start: 8, end: 20 }] },
    Friday: { enabled: true, slots: [{ id: "5", start: 8, end: 20 }] },
    Saturday: { enabled: false, slots: [] },
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const addSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { id: Date.now().toString(), start: 9, end: 17 }],
      },
    }))
  }

  const removeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((slot) => slot.id !== slotId),
      },
    }))
  }

  const saveSchedule = () => {
    console.log("Saving schedule:", { name: scheduleName, schedule })
     
  }

  const deleteSchedule = () => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      console.log("Deleting schedule")
       
      setScheduleName("New Schedule")
      setSchedule({
        Sunday: { enabled: false, slots: [] },
        Monday: { enabled: false, slots: [] },
        Tuesday: { enabled: false, slots: [] },
        Wednesday: { enabled: false, slots: [] },
        Thursday: { enabled: false, slots: [] },
        Friday: { enabled: false, slots: [] },
        Saturday: { enabled: false, slots: [] },
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col space-y-1.5 pb-6">
        <div className="flex items-center justify-between">
          <Input
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none p-0 focus-visible:ring-0 w-auto"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={deleteSchedule}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="default" size="sm" onClick={saveSchedule}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        <Select defaultValue="UTC+5:30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC+5:30">UTC+5:30 Mumbai/India</SelectItem>
            <SelectItem value="UTC+0">UTC+0 London</SelectItem>
            <SelectItem value="UTC-8">UTC-8 San Francisco</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <div />  
            <div className="grid grid-cols-24 relative h-6">
              {hours.map((hour) => (
                <div key={hour} className="absolute w-full h-6" style={{ left: `${(hour / 24) * 100}%` }}>
                  <span className="absolute -translate-x-1/2 text-xs text-muted-foreground">{hour}</span>
                </div>
              ))}
            </div>
          </div>

           
          {Object.entries(schedule).map(([day, { enabled, slots }]) => (
            <div key={day} className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    setSchedule((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], enabled: checked as boolean },
                    }))
                  }
                />
                <span className="font-medium">{day}</span>
              </div>

              <div className="relative h-8 bg-muted rounded-md">
                {enabled &&
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="absolute h-full bg-primary/20 border-l-2 border-r-2 border-l-green-500 border-r-red-500 group"
                      style={{
                        left: `${(slot.start / 24) * 100}%`,
                        width: `${((slot.end - slot.start) / 24) * 100}%`,
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeSlot(day, slot.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  disabled={!enabled}
                  onClick={() => addSlot(day)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

           
          <div className="flex gap-4 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-green-500" />
              <span>Start service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-red-500" />
              <span>Stop service</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

