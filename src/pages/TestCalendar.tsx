"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const generateHours = () => {
    return Array.from({ length: 17 }, (_, i) => {
        const hour = i + 6 < 10 ? `0${i + 6}` : `${i + 6}`
        return `${hour}:00`
    })
}

const generateWeekDays = (date: Date) => {
    const week = []
    const monday = new Date(date)
    const currentDay = date.getDay()
    const daysToMonday = (currentDay === 0 ? 6 : currentDay - 1) 
    monday.setDate(date.getDate() - daysToMonday)
  
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      week.push(day)
    }
    return week
  }

const sampleCourses = [
  { 
    id: 1, 
    title: "Mathematics 101", 
    start: "09:00", 
    end: "10:30",
    days: [1, 3],
    description: "Introduction to Calculus",
    location: "Room A101"
  },
  { 
    id: 2, 
    title: "Physics Lab", 
    start: "13:00", 
    end: "15:00",
    days: [2],
    description: "Practical experiments in mechanics",
    location: "Science Lab B"
  },
  { 
    id: 3, 
    title: "Literature Seminar", 
    start: "11:00", 
    end: "12:30",
    days: [4],
    description: "Discussion on modern poetry",
    location: "Library Hall"
  },
  {
    id: 4,
    title: "Computer Science",
    start: "14:00",
    end: "16:00",
    days: [1, 5],
    description: "Introduction to algorithms",
    location: "Computer Lab C"
  }
]

export default function TestCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("week")
  const hours = generateHours()
  const weekDays = generateWeekDays(currentDate)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 8 * 60)
    }
  }, [viewMode])

  const navigateCalendar = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const renderDayView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] w-full">
      <div className="pr-4">
        {hours.map((hour) => (
          <div key={hour} className="flex items-stretch border-t border-gray-300 h-20">
            <span className="w-16 text-sub-text1 py-2 sticky left-0 bg-white z-10">{hour}</span>
            <div className="flex-1 relative">
              {sampleCourses.filter(course => 
                course.start === hour && course.days.includes(currentDate.getDay())
              ).map(course => (
                <div
                  key={course.id}
                  className="absolute left-0 right-0 bg-[#dfe8ff] border-l-4 border-[#7287fd] p-2 rounded cursor-pointer hover:bg-[#c5d4ff] transition-colors overflow-hidden"
                  style={{
                    top: '0px',
                    height: `${(parseInt(course.end) - parseInt(course.start)) * 80}px`
                  }}
                  onClick={() => handleEventClick(course)}
                >
                  <p className="text-sm font-semibold truncate">{course.title}</p>
                  <p className="text-xs text-sub-text1 truncate">{`${course.start} - ${course.end}`}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )

  const renderWeekView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)]">
      <div className="min-w-[800px]">
        <div className="flex sticky top-0 bg-white z-10">
          <div className="w-16"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="flex-1 text-center p-2 text-sm font-semibold border-b border-gray-200">
              <div>{day.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div key={hour} className="flex items-stretch border-t border-gray-200 h-20">
            <span className="w-16 text-sm text-sub-text1 py-2 sticky left-0 bg-white z-10">{hour}</span>
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-1 relative border-l border-gray-100">
                {sampleCourses.filter(course => 
                  course.start === hour && course.days.includes(day.getDay())
                ).map(course => (
                  <div
                    key={course.id}
                    className="absolute top-0 left-0 right-0 bg-[#dfe8ff] border-l-4 border-[#7287fd] p-1 m-1 rounded cursor-pointer hover:bg-[#c5d4ff] transition-colors overflow-hidden"
                    style={{
                      height: `${(parseInt(course.end) - parseInt(course.start)) * 80}px`
                    }}
                    onClick={() => handleEventClick(course)}
                  >
                    <p className="text-xs font-semibold truncate">{course.title}</p>
                    <p className="text-xs text-sub-text1 truncate">{`${course.start} - ${course.end}`}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )

  return (
    <Card className="w-full h-full p-4">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <CardTitle className="text-heading text-xl font-bold">
          {viewMode === "day" 
            ? currentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : `Tuần ${weekDays[0].toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}`
          }
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigateCalendar(viewMode === "day" ? -1 : -7)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateCalendar(viewMode === "day" ? 1 : 7)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day" className="font-semibold">Trong ngày</TabsTrigger>
            <TabsTrigger value="week" className="font-semibold">Trong tuần</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="m-0">
            {renderDayView()}
          </TabsContent>
          <TabsContent value="week" className="m-0">
            {renderWeekView()}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-sub-text1">
                  <Clock className="mr-2 h-4 w-4" />
                  {selectedEvent?.start} - {selectedEvent?.end}
                </div>
                <div className="flex items-center text-sm text-sub-text1">
                  <MapPin className="mr-2 h-4 w-4" />
                  {selectedEvent?.location}
                </div>
                <div className="flex items-center text-sm text-sub-text1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedEvent?.days.map(day => 
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                  ).join(', ')}
                </div>
                <p className="text-sm text-sub-text2 mt-2">{selectedEvent?.description}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}