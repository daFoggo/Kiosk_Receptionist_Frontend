import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MapPin, Users, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { CalendarData } from "@/types/CalendarData";

interface WeeklyScheduleProps {
  tasks: CalendarData[];
}

interface TaskCardProps {
  task: CalendarData;
}

const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const TaskCard = ({ task }: TaskCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card>
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">{task.name}</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(task.iso_datetime.toString()).toLocaleTimeString(
              "vi-VN",
              { hour: "2-digit", minute: "2-digit" }
            )}
          </p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3 pt-0">
            <div className="grid gap-1">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                {task.location}
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4" />
                {task.attendees}
              </div>
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4" />
                {task.preparation}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

const WeeklySchedule = ({ tasks }: WeeklyScheduleProps) => {
  const groupTasksByDay = (tasks: CalendarData[]) => {
    const groupedTasks: { [key: string]: CalendarData[] } = {};

    tasks.forEach((task) => {
      const date = new Date(task.iso_datetime.toString());
      const dayIndex = date.getDay() - 1; 
      const adjustedDayIndex = dayIndex === -1 ? 6 : dayIndex; 
      const day = daysOfWeek[adjustedDayIndex];
      
      if (!groupedTasks[day]) {
        groupedTasks[day] = [];
      }
      groupedTasks[day].push(task);
    });

    return groupedTasks;
  };

  const groupedTasks = groupTasksByDay(tasks);
  const daysWithTasks = daysOfWeek.filter(day => groupedTasks[day]?.length > 0);

  return (
    <div className="flex flex-col gap-4">
      {daysWithTasks.map((day) => (
        <Card key={day} className="w-full border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{day}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {groupedTasks[day].map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeeklySchedule;
