import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Cake, IdCard } from "lucide-react";
import { TbGenderBigender } from "react-icons/tb";
import axios from "axios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ipChatTele } from "@/utils/ip";
import { MORNING_HOURS, AFTERNOON_HOURS, MINUTES } from "@/data/TimeSelect";
import { CCCDData } from "@/hooks/useWebsocket";

interface ContactProps {
  cccdData: CCCDData | null;
  onContactingComplete: () => void;
  resetCccdData: () => void;
}

interface FormData {
  isAppointment: boolean;
  appointmentHour: string;
  appointmentMinute: string;
  department: string;
  phoneNumber: string;
  note: string;
}

const DEPARTMENTS = [
  { value: "bld", label: "Ban lãnh đạo" },
  { value: "phongTh", label: "Phòng tổng hợp" },
  {
    value: "phongKhcnvkhkd",
    label: "Phòng Khoa học công nghệ và Kế hoạch kinh doanh",
  },
  { value: "phongTvtk", label: "Phòng tư vấn thiết kế" },
  {
    value: "phongNcktvdvvt",
    label: "Phòng nghiên cứu kỹ thuật và dịch vụ viễn thông",
  },
  {
    value: "phongDlkdvtccl",
    label: "Phòng đo lường kiểm định và tiêu chuẩn chất lượng",
  },
  {
    value: "phongUdvcgcns",
    label: "Phòng ứng dụng và chuyển giao công nghệ số",
  },
  { value: "phongNcptcns", label: "Phòng nghiên cứu phát triển công nghệ số" },
];

const Contact = ({ cccdData, onContactingComplete, resetCccdData }: ContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      isAppointment: false,
      appointmentHour: "08",
      appointmentMinute: "00",
      department: "",
      phoneNumber: "",
      note: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { appointmentHour, appointmentMinute, ...restData } = data;
      const appointmentTime = `${appointmentHour}:${appointmentMinute}`;
      const formDataToSubmit = {
        ...restData,
        appointmentTime,
        cccdInfo: {
          identityCode: cccdData?.["Identity Code"] || "",
          name: cccdData?.["Name"] || "",
          dob: cccdData?.["DOB"] || "",
          gender: cccdData?.["Gender"] || "",
        },
      };
      const response = await axios.post(ipChatTele, formDataToSubmit);
      if (response.data) {
        toast.success("Đã gửi thông tin thành công!");
        handleContactingComplete();
        resetCccdData();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi gửi thông tin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactingComplete = () => {
    onContactingComplete();
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string | undefined
  ) => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 min-w-[150px] text-sub-text1">
        {icon}
        <Label className="text-xl font-semibold">{label}</Label>
      </div>
      <Input value={value || ""} readOnly className="text-lg" tabIndex={-1} />
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="bg-base shadow-sm border rounded-xl p-4 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-2">
            Thông tin khách {cccdData?.["Name"] || ""}
          </h1>
          {renderField(
            <IdCard size={24} />,
            "Số CCCD",
            cccdData?.["Identity Code"]
          )}
          {renderField(<Cake size={24} />, "Ngày sinh", cccdData?.["DOB"])}
          {renderField(
            <TbGenderBigender size={24} />,
            "Giới tính",
            cccdData?.["Gender"]
          )}
        </div>

        <div className="shadow-sm border rounded-xl p-4 bg-white">
          <h1 className="text-2xl font-bold mb-4">Liên hệ với phòng ban</h1>

          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="isAppointment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-lavender data-[state=checked]:border-lavender"
                    />
                  </FormControl>
                  <FormLabel className="font-semibold text-lg">
                    Có lịch hẹn
                  </FormLabel>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              <FormLabel className="font-semibold text-lg self-start">
                Thời gian hẹn
              </FormLabel>
              <FormField
                control={form.control}
                name="appointmentHour"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-lg w-fit">
                          <SelectValue placeholder="Giờ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {MORNING_HOURS.map((hour) => (
                            <SelectItem
                              key={hour}
                              value={hour}
                              className="text-lg"
                            >
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          {AFTERNOON_HOURS.map((hour) => (
                            <SelectItem
                              key={hour}
                              value={hour}
                              className="text-lg"
                            >
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <span>:</span>
              <FormField
                control={form.control}
                name="appointmentMinute"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-lg w-fit">
                          <SelectValue placeholder="Phút" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {MINUTES.map((minute) => (
                            <SelectItem
                              key={minute}
                              value={minute}
                              className="text-lg"
                            >
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="department"
            rules={{ required: "Vui lòng chọn phòng ban" }}
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="font-semibold text-lg">
                  Phòng ban
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem
                          key={dept.value}
                          value={dept.value}
                          className="text-lg"
                        >
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="font-semibold text-lg">
                  Số điện thoại
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập số điện thoại"
                    className="text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="font-semibold text-lg">Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ghi chú"
                    className="text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-lg font-semibold bg-lavender hover:bg-lavender/90"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Liên hệ"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Contact;
