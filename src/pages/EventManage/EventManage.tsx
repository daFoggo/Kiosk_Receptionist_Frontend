import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { isAfter, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
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
} from "@/components/ui/dialog";
import {
  ipGetEvents,
  ipCreateEvent,
  ipPutEvent,
  ipDeleteEvent,
} from "@/utils/ip";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { DialogDescription } from "@radix-ui/react-dialog";
import { IEventManage, IFormData } from "@/models/EventManage/EventManage";

const timeZone = "Asia/Ho_Chi_Minh";

const EventManage = () => {
  const [eventData, setEventData] = useState<IEventManage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEventManage | null>(null);
  const navigate = useNavigate();
  const form = useForm<IFormData>({
    defaultValues: {
      name: "",
      start_time: toZonedTime(new Date(), timeZone),
      end_time: toZonedTime(new Date(), timeZone),
      location: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      navigate("/admin/login");
      return;
    }
    getEventData();
  }, [navigate]);

  const getEventData = async () => {
    try {
      const response = await axios.get(ipGetEvents, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEventData(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting event data:", error);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.reset({
      name: "",
      start_time: toZonedTime(new Date(), timeZone),
      end_time: toZonedTime(new Date(), timeZone),
      location: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      start_time: toZonedTime(parseISO(event.start_time), timeZone),
      end_time: toZonedTime(parseISO(event.end_time), timeZone),
      location: event.location,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (event: any) => {
    try {
      await axios.delete(`${ipDeleteEvent}/${event.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Xóa sự kiện thành công");
      getEventData();
    } catch (error) {
      toast.error("Xóa sự kiện thất bại");
      console.error("Error deleting event:", error);
    }
  };

  const onSubmit = async (data: IFormData) => {
    if (isAfter(data.start_time, data.end_time)) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const adjustedData = {
      ...data,
      start_time: formatInTimeZone(
        data.start_time,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      end_time: formatInTimeZone(
        data.end_time,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
    };

    console.log(adjustedData);

    try {
      if (editingEvent) {
        await axios.put(`${ipPutEvent}/${editingEvent.id}`, adjustedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Cập nhật sự kiện thành công");
      } else {
        await axios.post(ipCreateEvent, adjustedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Thêm sự kiện thành công");
      }
      setIsDialogOpen(false);
      getEventData();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Cập nhật sự kiện thất bại");
    }
  };

  const eventDataColumns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Tên sự kiện",
    },
    {
      accessorKey: "start_time",
      header: "Thời gian bắt đầu",
      cell: ({ row }: any) => {
        const startTime: string = row.getValue("start_time");
        return formatInTimeZone(
          parseISO(startTime),
          timeZone,
          "dd/MM/yyyy HH:mm:ss",
          { locale: vi }
        );
      },
    },
    {
      accessorKey: "end_time",
      header: "Thời gian kết thúc",
      cell: ({ row }: any) => {
        const endTime: string = row.getValue("end_time");
        return formatInTimeZone(
          parseISO(endTime),
          timeZone,
          "dd/MM/yyyy HH:mm:ss",
          { locale: vi }
        );
      },
    },
    {
      accessorKey: "location",
      header: "Địa điểm",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold font-sans text-2xl">Quản lý sự kiện</h1>
        <DataTable
          columns={eventDataColumns}
          data={eventData}
          onAdd={handleAddEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          filterPlaceholder="Tìm kiếm sự kiện..."
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90%] rounded-xl sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tên sự kiện không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sự kiện</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên sự kiện" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                rules={{ required: "Thời gian bắt đầu không được để trống" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(date: any) =>
                          field.onChange(toZonedTime(date, timeZone))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                rules={{ required: "Thời gian kết thúc không được để trống" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(date: any) =>
                          field.onChange(toZonedTime(date, timeZone))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                rules={{ required: "Địa điểm không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập địa điểm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  onClick={() => {
                    form.reset();
                    setIsDialogOpen(false);
                  }}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingEvent ? "Cập nhật" : "Thêm"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManage;
