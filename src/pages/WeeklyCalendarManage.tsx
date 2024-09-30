import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import type { CalendarData } from "@/types/CalendarData";
import scheduleMock from "../sampleData/schedule.json";

interface FormData {
  file: FileList;
}

const WeeklyCalendarManage = () => {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const form = useForm<FormData>({
    defaultValues: {
      file: undefined,
    },
  });

  useEffect(() => {
    getCalendarData();
  }, [navigate]);

  const getCalendarData = async () => {
    try {
      setCalendarData(scheduleMock);
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.log(error);
    }
  };

  const handleAddCalendar = (event: any) => {
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const file = data.file[0];
      if (!file) {
        toast.error('Vui lòng chọn một tệp để tải lên');
        return;
      }

      if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        toast.error('Chỉ chấp nhận tệp .docx');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        throw new Error('Tải lên thất bại');
      }

      toast.success('Tệp đã được tải lên thành công');
      setIsDialogOpen(false);

      getCalendarData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Đã xảy ra lỗi khi tải lên tệp');
    }
  };

  const calendarDataColumns = [
    {
      accessorKey: "name",
      header: "Công việc",
    },
    {
      accessorKey: "date",
      header: "Ngày",
    },
    {
      accessorKey: "time",
      header: "Thời gian",    

    },  
    {
      accessorKey: "location",
      header: "Địa điểm",
    },
    {
      accessorKey: "attendees",
      header: "Thành phần",
    },
    {
      accessorKey: "preparation",
      header: "Chuẩn bị",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold font-sans text-2xl">Quản lý lịch tuần</h1>
        <DataTable
          columns={calendarDataColumns}
          data={calendarData}
          onAdd={handleAddCalendar}
          filterPlaceholder="Tìm kiếm công việc..."
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90%] rounded-xl sm:w-full">
          <DialogHeader>
            <DialogTitle>Tải lên lịch tuần mới</DialogTitle>
            <DialogDescription>
              Chỉ chấp nhận tệp .docx.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tệp lịch tuần</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".docx"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Tải lên</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendarManage;