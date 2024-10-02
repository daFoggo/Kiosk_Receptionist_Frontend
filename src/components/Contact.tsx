import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Cake, IdCardIcon } from "lucide-react";
import { TbGenderBigender } from "react-icons/tb";
import { Checkbox } from "./ui/checkbox";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import { ipChatTele } from "@/utils/ip";

interface FormData {
  isAppointment: boolean;
  department: string;
  phoneNumber: string;
  note: string;
  cccdInfo: {
    identityCode: string;
    name: string;
    dob: string;
    gender: string;
  };
}

const Contact = ({ cccdData }: { cccdData: Record<string, string> | null }) => {
  const form = useForm<FormData>({
    defaultValues: {
      isAppointment: false,
      department: "",
      phoneNumber: "",
      note: "",
      cccdInfo: {
        identityCode: cccdData?.["Identity Code"] || "",
        name: cccdData?.["Name"] || "",
        dob: cccdData?.["DOB"] || "",
        gender: cccdData?.["Gender"] || "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const resposne = await axios.post(ipChatTele, data);
      console.log(resposne);
      toast.success("Đã gửi thông tin thành công!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi gửi thông tin!");
    }
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string | undefined
  ) => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[150px] text-sub-text1">
          {icon}
          <Label className="text-xl font-semibold">{label}</Label>
        </div>
        <Input value={value || ""} readOnly className="text-lg" tabIndex={-1} />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full items-center h-auto"
      >
        <div className="flex flex-col gap-2 p-4 bg-base shadow-sm border rounded-xl w-full">
          <h1 className="text-2xl font-bold mb-4">
            Thông tin khách {cccdData?.["Name"] || ""}
          </h1>
          {renderField(
            <IdCardIcon size={24} />,
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

        <div className="flex flex-col gap-4 p-4 shadow-sm border rounded-xl w-full">
          <h1 className="text-2xl font-bold mb-4">Liên hệ với phòng ban</h1>
          <FormField
            control={form.control}
            name="isAppointment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className=" data-[state=checked]:bg-lavender data-[state=checked]:border-lavender"
                  />
                </FormControl>
                <FormLabel className="font-semibold text-lg">
                  Có lịch hẹn
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  Phòng ban
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="text-lg">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-lg">
                        Các phòng ban
                      </SelectLabel>
                      <SelectItem value="bld" className="text-lg">
                        Ban lãnh đạo
                      </SelectItem>
                      <SelectItem value="phongTh" className="text-lg">
                        Phòng tổng hợp
                      </SelectItem>
                      <SelectItem value="phongKhcnvkhcd" className="text-lg">
                        Phòng Khoa học công nghệ và Kế hoạch kinh doanh
                      </SelectItem>
                      <SelectItem value="phongTvtk" className="text-lg">
                        Phòng tư vấn thiết kế
                      </SelectItem>
                      <SelectItem value="phongNckyvdvvt" className="text-lg">
                        Phòng nghiên cứu kỹ thuật và dịch vụ viễn thông
                      </SelectItem>
                      <SelectItem value="phongDlkdvtccl" className="text-lg">
                        Phòng đo lường kiểm định và tiêu chuẩn chất lượng
                      </SelectItem>
                      <SelectItem value="phongUdvcgcns" className="text-lg">
                        Phòng ứng dụng và chuyển giao công nghệ số
                      </SelectItem>
                      <SelectItem value="phongNcptcns" className="text-lg">
                        Phòng nghiên cứu phát triển công nghệ số
                      </SelectItem>
                      <SelectItem value="cs2" className="text-lg">
                        Cơ sở 2 của Viện tại TP.Hồ Chí Minh
                      </SelectItem>
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
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  Số điện thoại
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập số điện thoại"
                    {...field}
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
              <FormItem>
                <FormLabel className="font-semibold text-lg">Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ghi chú"
                    className="text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-lg font-semibold hover:bg-lavender/90 bg-lavender"
          >
            Liên hệ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Contact;
